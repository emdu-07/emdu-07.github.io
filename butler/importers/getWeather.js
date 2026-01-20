import { getWeather } from "https://esm.town/v/emdu-07/getWeather";
import { sqlite } from "https://esm.town/v/emdu-07/sqlite";
import Anthropic from "npm:@anthropic-ai/sdk@0.24.3";

const TABLE_NAME = "memories";

function summarizeWeather(weather) {
  const summarizeDay = (day) => ({
    date: day.date,
    highTemp: day.maxtempF,
    lowTemp: day.mintempF,
    hourly:
      day.hourly?.map((hour) => ({
        time: hour.time,
        temp: hour.tempF,
        chanceOfRain: hour.chanceofrain,
        chanceOfSnow: hour.chanceofsnow,
        desc: (hour.weatherDesc || []).map((d) => d.value).join(", "),
      })) ?? [],
  });

  return (weather.weather || []).map(summarizeDay);
}

async function generateConciseWeatherSummary(weatherDay) {
  try {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      console.error("Anthropic API key is not configured.");
      return null;
    }

    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 150,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
You are a weather forecaster. Create a very concise summary of this weather forecast data.
Include the high and low temperatures and a brief summary of the overall weather conditions throughout the day.
The summary should be helpful for someone planning their day - mention any precipitation, temperature changes, or other notable patterns.
Keep it under 25 words if possible, no more than one sentence. Don't include the date.

Examples:
- "High of 50, low of 31, clear and sunny all day."
- "High of 80, low of 50, cool and clear morning, warmer afternoon with scattered showers starting around 2pm."

Weather data:
${JSON.stringify(weatherDay, null, 2)}

Your concise summary:
`,
            },
          ],
        },
      ],
    });

    let summary = (response?.content?.[0]?.text || "").trim();

    summary = summary.replace(/^(your concise summary:)/i, "").trim();
    summary = summary.replace(/^["']|["']$/g, "").trim();

    return summary;
  } catch (error) {
    console.error("Error generating weather summary:", error);
    return JSON.stringify(weatherDay); // fallback
  }
}

async function deleteExistingForecast(date) {
  await sqlite.execute(
    `
    DELETE FROM ${TABLE_NAME}
    WHERE date = ? AND text LIKE 'weather forecast:%'
  `,
    [date]
  );
}

async function insertForecast(date, forecast) {
  const { nanoid } = await import("https://esm.sh/nanoid@5.0.5");

  await sqlite.execute(
    `
    INSERT INTO ${TABLE_NAME} (id, date, text, createdBy, createdDate, tags)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
    [
      nanoid(10),
      date,
      `weather forecast: ${forecast}`,
      "weather",
      Date.now(),
      "weather",
    ]
  );
}

export default async function getWeatherForecast(interval) {
  const weather = await getWeather("Waterloo, Ontario");
  console.log({ weather });

  const summary = summarizeWeather(weather);

  for (const day of summary) {
    const date = new Date(day.date).toISOString().split("T")[0];

    const conciseSummary = await generateConciseWeatherSummary(day);
    const forecastText = conciseSummary || JSON.stringify(day);

    await deleteExistingForecast(date);
    await insertForecast(date, forecastText);
  }

  console.log("Weather forecast updated in the database.");
  return summary;
}
