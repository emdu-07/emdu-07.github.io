import { DateTime } from "https://esm.sh/luxon@3.4.4";
import Anthropic from "npm:@anthropic-ai/sdk@0.24.3";
import nacl from "npm:tweetnacl@1.0.3";
import { nanoid } from "https://esm.sh/nanoid@5.0.5";

import { backstory } from "../backstory.ts";
import { formatMemoriesForPrompt, getRelevantMemories } from "../memoryUtils.ts";

// ---- Bot identity ----
export const BOT_SENDER_ID = "mr_bilbo_bot";
export const BOT_SENDER_NAME = "Mr. Bilbo";

// ---- Env vars required ----
// Set these in Val Town environment variables:
//   discordPublicKey: your app public key (for verifying requests)
//   ANTHROPIC_API_KEY: your Anthropic key
const DISCORD_PUBLIC_KEY = Deno.env.get("discordPublicKey");
if (!DISCORD_PUBLIC_KEY) throw new Error("discordPublicKey is not set");

// --------------------
// Discord verification
// --------------------
function hexToUint8Array(hex) {
  if (typeof hex !== "string" || hex.length % 2 !== 0) return new Uint8Array();
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return arr;
}

async function verifyDiscordRequest(req, rawBody) {
  const signature = req.headers.get("X-Signature-Ed25519");
  const timestamp = req.headers.get("X-Signature-Timestamp");
  if (!signature || !timestamp) return false;

  const message = new TextEncoder().encode(timestamp + rawBody);
  const sig = hexToUint8Array(signature);

  // Discord public key is hex-encoded
  const publicKey = hexToUint8Array(DISCORD_PUBLIC_KEY);

  return nacl.sign.detached.verify(message, sig, publicKey);
}

// --------------------
// Conversation helpers
// --------------------
function getConversationId({ guild_id, channel_id, user_id }) {
  // DMs: key by user so the convo stays stable even if Discord changes DM channel IDs
  if (!guild_id) return `dm:${user_id}`;
  // Servers/threads: key by channel
  return `chan:${channel_id}`;
}

function truncateDiscord(text, max = 1900) {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max - 20).trimEnd() + "\n\n(…truncated)";
}

// --------------------
// DB: store + history
// --------------------
export async function storeChatMessage(
  conversationId,
  channelId,
  guildId,
  senderId,
  senderName,
  message,
  isBot = false
) {
  try {
    const { sqlite } = await import("https://esm.town/v/stevekrouse/sqlite");
    const timestamp = Math.floor(Date.now() / 1000);

    await sqlite.execute({
      sql: `
        INSERT INTO discord_chats (
          conversation_id, channel_id, guild_id,
          sender_id, sender_name, message, timestamp, is_bot
        ) VALUES (
          :conversation_id, :channel_id, :guild_id,
          :sender_id, :sender_name, :message, :timestamp, :is_bot
        )
      `,
      args: {
        conversation_id: conversationId,
        channel_id: String(channelId),
        guild_id: guildId ? String(guildId) : null,
        sender_id: String(senderId),
        sender_name: String(senderName),
        message: String(message),
        timestamp,
        is_bot: isBot ? 1 : 0,
      },
    });

    return true;
  } catch (err) {
    console.error("Error storing chat message:", err);
    return false;
  }
}

export async function getChatHistory(conversationId, limit = 50) {
  try {
    const { sqlite } = await import("https://esm.town/v/stevekrouse/sqlite");

    // Get *most recent* N then reverse to chronological
    const result = await sqlite.execute({
      sql: `
        SELECT * FROM discord_chats
        WHERE conversation_id = :conversation_id
        ORDER BY timestamp DESC
        LIMIT :limit
      `,
      args: {
        conversation_id: conversationId,
        limit,
      },
    });

    const rows = result.rows || [];
    return rows.reverse();
  } catch (err) {
    console.error("Error retrieving chat history:", err);
    return [];
  }
}

function formatChatHistoryForAI(history) {
  const messages = [];
  for (const msg of history) {
    if (msg.is_bot) {
      messages.push({ role: "assistant", content: msg.message });
    } else {
      messages.push({
        role: "user",
        content: `${msg.sender_name} says: ${msg.message}`,
      });
    }
  }
  return messages;
}

// --------------------
// AI analysis + memory tags
// --------------------
async function analyzeMessageContent(anthropic, username, messageText, chatHistory = []) {
  try {
    const memories = await getRelevantMemories();
    const memoriesText = formatMemoriesForPrompt(memories);

    const systemPrompt = `${backstory}

Your job is to read this Discord message from your employer and respond in a natural, butler-like way, noting any important information that should be remembered for future reference.

You have access to the following stored memories:

${memoriesText}

If this appears to be a new client or the conversation is in an early stage, you should conduct an intake interview to gather essential background information. First ask the client if now is a good time to ask them some questions.

Ask about the following topics in a conversational way (not all at once, but continuing the interview naturally based on their responses):

Initial Information:
- Who are the family members living in the home and their ages?
- Names of close family members and their relationships to the client?

Daily Life:
- Which grocery stores and local restaurants they frequent?
- Family members' food preferences and any dietary restrictions?
- Typical working hours and recurring commitments?
- Important dates (birthdays, anniversaries, holidays)?
- Monthly bills and subscriptions that need tracking?
- Emergency contacts and regular service providers?
- Current health goals and any medication reminders needed?

Your goal is to collect this information naturally through conversation and store it as memories (as undated memories). Once you've gathered sufficient background information, you can conclude the intake process and transition to normal reactive chat.

If the conversation is already past the intake stage, then analyze the message content and think about which memories might be worth creating based on the information provided.

You should respond in a natural conversational way. You have three options for managing memories:

1. CREATE memories: Include them in <createMemories> tags in JSON format.
2. EDIT memories: Include them in <editMemories> tags in JSON format (must include memory ID).
3. DELETE memories: Include them in <deleteMemories> tags in JSON format (just include memory IDs).

Important guidelines for memory management:
1. For new memories, set a date for each memory whenever possible.
2. The date should be the actual date of the event. You don't need to set reminder dates in advance.
3. Keep the memory text concise: ideally one short sentence, but include all important details.
4. Extract any dates mentioned and convert them to ISO format. If the year isn't mentioned, assume the current year.
5. If no date is relevant to the memory, set "date" to null.
6. For editing or deleting memories, you MUST include the correct memory ID from the displayed memories. Each memory is displayed with its ID in the format "[ID: xyz123]".
7. If no memories need to be managed, simply respond naturally WITHOUT including any memory tags.
8. When a user asks to delete a memory, you must find its ID from the memory list above and include that ID in the deleteMemories tag.
9. Do not create duplicate memories. If a memory already exists, do not record the same information again.

Your response style:
- Use a brief, natural-sounding tone characteristic of a personal assistant
- Be slightly dignified but sound modern, not too stuffy or old-fashioned
- Keep responses brief (1-2 sentences)
- Vary your responses to avoid sounding robotic
- Be polite and deferential
- Avoid contractions (use "do not" instead of "don't")

Today's date is ${DateTime.now()
  .setZone("America/Toronto")
  .toFormat("yyyy-MM-dd")}`;

    const formattedHistory = chatHistory.length ? formatChatHistoryForAI(chatHistory) : [];

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 2000,
      system: systemPrompt,
      messages: formattedHistory,
    });

    const responseText = response.content?.[0]?.text || "";

    const createMemoryMatch = responseText.match(/<createMemories>([\s\S]*?)<\/createMemories>/);
    const editMemoryMatch = responseText.match(/<editMemories>([\s\S]*?)<\/editMemories>/);
    const deleteMemoryMatch = responseText.match(/<deleteMemories>([\s\S]*?)<\/deleteMemories>/);

    let cleanedResponse = responseText;
    let memoriesToCreate = [];
    let memoriesToEdit = [];
    let memoriesToDelete = [];

    if (createMemoryMatch) {
      cleanedResponse = cleanedResponse.replace(/<createMemories>[\s\S]*?<\/createMemories>/, "").trim();
      try { memoriesToCreate = JSON.parse(createMemoryMatch[1]); } catch (e) { console.error(e); }
    }
    if (editMemoryMatch) {
      cleanedResponse = cleanedResponse.replace(/<editMemories>[\s\S]*?<\/editMemories>/, "").trim();
      try { memoriesToEdit = JSON.parse(editMemoryMatch[1]); } catch (e) { console.error(e); }
    }
    if (deleteMemoryMatch) {
      cleanedResponse = cleanedResponse.replace(/<deleteMemories>[\s\S]*?<\/deleteMemories>/, "").trim();
      try { memoriesToDelete = JSON.parse(deleteMemoryMatch[1]); } catch (e) { console.error(e); }
    }

    cleanedResponse = cleanedResponse.replace(/\n{3,}/g, "\n\n");

    return {
      memories: memoriesToCreate,
      editMemories: memoriesToEdit,
      deleteMemories: memoriesToDelete,
      response: cleanedResponse || "Very good. I shall attend to it.",
    };
  } catch (err) {
    console.error("Message analysis error:", err);
    return {
      memories: [],
      editMemories: [],
      deleteMemories: [],
      response: "I do apologize, but I seem to be experiencing some difficulty at the moment.",
    };
  }
}

// --------------------
// Memories CRUD (same as yours)
// --------------------
async function applyMemoryChanges(analysis) {
  const { sqlite } = await import("https://esm.town/v/stevekrouse/sqlite");

  // Create
  if (analysis.memories?.length) {
    const createdIds = [];
    for (const memory of analysis.memories) {
      const memoryId = nanoid(10);
      createdIds.push(memoryId);
      await sqlite.execute({
        sql: `
          INSERT INTO memories (id, date, text, createdBy, createdDate, tags)
          VALUES (:id, :date, :text, :createdBy, :createdDate, :tags)
        `,
        args: {
          id: memoryId,
          date: memory.date ?? null,
          text: memory.text ?? "",
          createdBy: "discord",
          createdDate: Date.now(),
          tags: memory.tags ?? "",
        },
      });
    }
    console.log(`Created ${analysis.memories.length} memories: ${createdIds.join(", ")}`);
  }

  // Edit
  if (analysis.editMemories?.length) {
    const editedIds = [];
    for (const memory of analysis.editMemories) {
      if (!memory.id) continue;
      editedIds.push(memory.id);

      const updateFields = [];
      const args = { id: memory.id };

      if (memory.text !== undefined) { updateFields.push("text = :text"); args.text = memory.text; }
      if (memory.date !== undefined) { updateFields.push("date = :date"); args.date = memory.date; }
      if (memory.tags !== undefined) { updateFields.push("tags = :tags"); args.tags = memory.tags; }

      if (updateFields.length) {
        await sqlite.execute({
          sql: `UPDATE memories SET ${updateFields.join(", ")} WHERE id = :id`,
          args,
        });
      }
    }
    console.log(`Edited ${editedIds.length} memories: ${editedIds.join(", ")}`);
  }

  // Delete
  if (analysis.deleteMemories?.length) {
    for (const memoryId of analysis.deleteMemories) {
      await sqlite.execute({
        sql: `DELETE FROM memories WHERE id = :id`,
        args: { id: memoryId },
      });
    }
    console.log(`Deleted ${analysis.deleteMemories.length} memories: ${analysis.deleteMemories.join(", ")}`);
  }
}

// --------------------
// Main HTTP handler
// --------------------
export default async function (req) {
  if (req.method !== "POST") {
    return new Response(
      `<h1>Mr. Bilbo (Discord)</h1><p>This endpoint handles Discord slash-command interactions.</p>`,
      { status: 200, headers: { "content-type": "text/html" } }
    );
  }

  const rawBody = await req.text();

  const verified = await verifyDiscordRequest(req, rawBody);
  if (!verified) {
    return new Response("signature invalid", { status: 401 });
  }

  const interaction = JSON.parse(rawBody);

  // Discord PING (type 1) -> respond with PONG (type 1)
  if (interaction.type === 1) {
    return Response.json({ type: 1 });
  }

  // We only handle slash commands here (type 2)
  if (interaction.type !== 2) {
    return Response.json({
      type: 4,
      data: { content: "I only respond to slash commands at the moment." },
    });
  }

  try {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return Response.json({
        type: 4,
        data: { content: "I apologize, but I am not properly configured at the moment." },
      });
    }
    const anthropic = new Anthropic({ apiKey });

    const commandName = interaction.data?.name || "";
    const options = interaction.data?.options || [];

    // Expect an option named "message" (string)
    const messageOpt = options.find((o) => o?.name === "message");
    const messageText = (messageOpt?.value || "").toString().trim();

    // Basic “start/introduction”
    if (commandName === "start" || messageText === "/start" || messageText === "!start") {
      const intro =
        "Good day. I am Mr. Bilbo, at your service. I shall make note of any important matters you wish me to remember. Would you mind if I ask you a few questions?";
      return Response.json({ type: 4, data: { content: intro } });
    }

    if (!messageText) {
      return Response.json({
        type: 4,
        data: { content: "Kindly provide a message. For example: /bilbo message: \"What shall I do today?\"" },
      });
    }

    // Identify user + channel context
    const channelId = interaction.channel_id;
    const guildId = interaction.guild_id || null;

    // user differs for DMs vs guild
    const user = interaction.member?.user || interaction.user;
    const userId = user?.id;
    const username = user?.global_name || user?.username || "Sir/Madam";

    const conversationId = getConversationId({
      guild_id: guildId,
      channel_id: channelId,
      user_id: userId,
    });

    // Store incoming
    await storeChatMessage(conversationId, channelId, guildId, userId, username, messageText, false);

    // Load history (includes the message we just inserted)
    const chatHistory = await getChatHistory(conversationId, 50);

    // Analyze + respond
    const analysis = await analyzeMessageContent(anthropic, username, messageText, chatHistory);

    // Apply memory changes
    await applyMemoryChanges(analysis);

    // Store bot reply
    await storeChatMessage(
      conversationId,
      channelId,
      guildId,
      BOT_SENDER_ID,
      BOT_SENDER_NAME,
      analysis.response,
      true
    );

    return Response.json({
      type: 4,
      data: { content: truncateDiscord(analysis.response) },
    });
  } catch (err) {
    console.error(err);
    return Response.json({
      type: 4,
      data: {
        content:
          "I do apologize, but I seem to be experiencing some difficulty at the moment. Perhaps we could try again shortly.",
      },
    });
  }
}
