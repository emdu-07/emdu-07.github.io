const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const loadingEl = document.getElementById("loading");

const WIDTH = 800;
const HEIGHT = 600;

const imageFiles = {
  menuExit: "menu_exit.png",
  menuInstructions: "instructions.png",
  menuQuiz: "quiz.png",
  menuBackstory: "backstory.png",
  menuReplay: "replaycutscene.png",
  menuPlay: "play.png",
  returnButton: "return.png",
  nextPage: "nextpage.png",
  prevPage: "prevpage.png",
  start: "start.png",
  exit: "exit.png",
  yes: "yes.png",
  no: "no.png",
  menuBg: "menu_bg.png",
  bookPage: "bookpage.png",
  hotelBg: "hotelbg.png",
  gameBg: "playBg.jpg",
  backgroundInfo: "BgInfo.png",
  clientList: "NotebookClue.png",
  clientListZoomed: "NotebookClueZoom.png",
  fireExit1: "FireExitClue1.png",
  fireExit2: "FireExitClue2.png",
  businessCard: "ScottCardClue.png",
  bodyClue: "ScottBodyClue.png",
  woolClue: "WoolClue.png",
  svenAlibi: "SvenAlibi.jpg",
  ameliaAlibi: "AmeliaAlibi.jpg",
  maidAlibi: "MaidAlibi.jpg",
  douglasAlibi: "DouglasAlibi.jpg",
  clarkAlibi: "ClarkAlibi.jpg",
  ending1: "Ending1.jpg",
  ending2: "Ending2.jpg",
  ending3: "Ending3.jpg",
  ending4: "Ending4.jpg",
  ameliaName: "AmeliaName.jpg",
  clarkName: "ClarkName.jpg",
  douglasName: "DouglasName.jpg",
  maidName: "MaidName.jpg",
  svenName: "SvenName.jpg"
};

const frameFiles = Array.from({ length: 30 }, (_, i) => `frame${i + 1}.png`);

const images = {};
let animationFrames = [];

const bgAudio = new Audio("suspense-dark-ambient.mp3");
bgAudio.loop = true;
bgAudio.volume = 0.6;
let audioStarted = false;

const clueHitboxes = [
  { id: 1, x: 530, y: 345, w: 40, h: 40 },
  { id: 2, x: 750, y: 420, w: 40, h: 40 },
  { id: 3, x: 200, y: 130, w: 40, h: 40 },
  { id: 4, x: 475, y: 350, w: 40, h: 40 },
  { id: 5, x: 200, y: 340, w: 40, h: 40 }
];

const questions = [
  [
    "What was the name of the company Scott worked under?",
    [
      "WillowHill Services",
      "IvoryCourt Estates.Ltd",
      "Saffron Valley Real Estates",
      "Willow Meadow.Inc"
    ]
  ],
  [
    "What novel was Scott reading in the beginning cutscene?",
    ["The Odyssey", "Sherlock Holmes", "Jane Eyre", "Romeo and Juliet"]
  ],
  ["The murderer broke Scott's window while escaping.", ["False", "True"]],
  [
    "What was the name of the rival company that Sven worked together with?",
    [
      "MeadowDale Inc.",
      "WillowHill Services",
      "IvoryCourt Estates.Ltd",
      "CourtIvory Estates"
    ]
  ],
  ["Which one of these items was used in Scott's murder?", ["A gun", "A knife", "A chainsaw", "Poison"]],
  ["What was the weather on the day of Scott's murder?", ["Cloudy", "Rainy", "Sunny", "Snowy"]],
  ["What was the culprit's motive for murder?", ["Lunacy", "Adultery", "Money fraud", "Robbery"]],
  [
    "How did the killer escape through Scott's window?",
    [
      "He didn't escape through the window",
      "Smashing the window glass",
      "Jumping out the window",
      "A fire escape outside the window"
    ]
  ]
];

const correctAnswers = [0, 1, 0, 2, 1, 1, 2, 3];

const instructionsLines = [
  "This game is an interactive murder mystery, where",
  "you, the player, are a crime investigator. Scott",
  "Maguire has been murdered, and it is up to you to",
  "find the murderer in a group of people all",
  "staying at a hotel. The amount of clues found, the",
  "person the player chooses to convict, and the",
  "amount of time taken will all lead to different",
  "endings (all but one being a bad ending). If not all",
  "clues are found in the given time limit, you will",
  "have to pick a culprit without being given the chance",
  "to review all the suspects alibis."
];

const backstoryPages = [
  {
    title: "Backstory Pt.1",
    lines: [
      "It was August 13th, 1989, and a young man named Sven",
      "Hastings was on his way to get a loan from WillowHill",
      "Services. Sven Hastings was a terrible gambling addict, and",
      "at the age of 23 had lost all his wealth gambling away at slots",
      "and blackjack at the nearby casino. With no money to his",
      "nearby casino. With no money to his name, Sven had no",
      "way to cover his daily expenses and debt he had racked",
      "up, and, in desperation, decided that getting a loan was his",
      "only option. Meanwhile, Scott Maguire was but 20 at",
      "the time, and was preparing to meet his first client. He",
      "had recently gotten a job at WillowHill Services, and was",
      "still getting the hand of the ropes."
    ]
  },
  {
    title: "Backstory Pt.2",
    lines: [
      "He knew that he would need to use every trick in the book",
      "to persuade his client, else his career and salary would",
      "suffer greatly. And so, the fateful meeting between the two",
      "took place. Scott succeeded, and Sven walked away with his",
      "money - or so he thought. Later that week, when Sven went",
      "to the bank to take out some cash, he was shocked to find",
      "that there was nothing, the same as it had been before he got",
      "the loan. Turned out, when Sven later looked at WillowHill's",
      "company policy, it was stated, in fine print, that they were",
      "not liable for whatever happened to the money after it had",
      "been given to the client, and that they would still be",
      "subject to loan collection."
    ]
  },
  {
    title: "Backstory Pt.3",
    lines: [
      "Sven was, understandably, furious and tried to take this to",
      "court stating that he never received the money in the first",
      "place. But what could someone like him do against a company",
      "with more power than he could ever dream of having? So",
      "Sven developed a seething hatred for WillowHill Services and",
      "vowed revenge, for Scott Maguire had ruined his life and",
      "he wanted the same fate to befall Scott as well. So when he",
      "was given the opportunity to team up with WillowHill",
      "Services competitor IvoryCourt Estates Ltd, to take out",
      "WillowHill's best agent, he took it right away. Scott",
      "Maguire had been a thorn in IvoryCourt Estates for",
      "quite a while now."
    ]
  },
  {
    title: "Backstory Pt.4",
    lines: [
      "Their potential and current clients were persuaded by Scott",
      "to switch to WillowHill Services, and IvoryCourt Estates was",
      "losing business. And so, they had done some digging to find",
      "one of Scott's oldest clients, someone who had a deep seated",
      "grudge against Scott Maguire to eliminate him for the benefit",
      "of their company. In that case, if the culprit was ever found",
      "out, they could have him take all the blame and suffer no",
      "damage to their reputation. Sven, blinded by the thought of",
      "money and finally getting his revenge against Scott, paid",
      "no mind to the red flags in front of him and proceeded to take",
      "IvoryCourt Estates up on the offer. He planned everything",
      "out meticulosly and finally, on April 10th, 1994, got the",
      "perfect opportunity to execute his plan."
    ]
  }
];

const bibliographyLines = [
  "Music:",
  "Defekt Maschine, Pixabay, https://pixabay.com/music/ambient-suspense-dark-ambient-8413/",
  "Images:",
  "Fire Stairs: Nelson Ndongala, Unsplash,",
  "https://unsplash.com/photos/AuBmgZWdzy8",
  "Hotel: Betty Langley's Hotel,",
  "https://www.battylangleys.com/rooms/superior-double",
  "Book PNG Images Open Book PNG Design, ppt-backgrounds.net",
  "https://www.ppt-backgrounds.net/macbeth/7210-book-png-images-open-book-png-design-image-backgrounds.html",
  "Dialog box Video game Dialogue, pngwing.com",
  "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.com%2Fen%2Ffree-png-kelsv&psig=AOvVaw3YYJyt9P4vZjRSpttj33Qd&ust=1642721239429000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCOCB_9H7vvUCFQAAAAAdAAAAABAD"
];

const gameState = {
  clues: [false, false, false, false, false],
  allFound: false,
  quizScore: 0
};

let screen = { name: "loading", startedAt: performance.now(), data: {} };
let uiButtons = [];

function setScreen(name, data = {}) {
  screen = { name, startedAt: performance.now(), data };
}

function resetGameState() {
  gameState.clues = [false, false, false, false, false];
  gameState.allFound = false;
}

function startAudio() {
  if (!audioStarted) {
    audioStarted = true;
    bgAudio.play().catch(() => {});
  }
}

function loadImage(name, src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      images[name] = img;
      resolve();
    };
    img.onerror = reject;
    img.src = src;
  });
}

function loadAssets() {
  const fileEntries = Object.entries(imageFiles);
  const imagePromises = fileEntries.map(([name, src]) => loadImage(name, src));
  const framePromises = frameFiles.map((src) => loadImage(src, src));
  return Promise.all([...imagePromises, ...framePromises]);
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = WIDTH * ratio;
  canvas.height = HEIGHT * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.imageSmoothingEnabled = true;
}

function clearButtons() {
  uiButtons = [];
}

function addButton(rect, onClick) {
  uiButtons.push({ rect, onClick });
}

function addImageButton(imgKey, x, y, scale, onClick) {
  const img = images[imgKey];
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, x, y, w, h);
  addButton({ x, y, w, h }, onClick);
}

function wrapText(text, font, maxWidth) {
  ctx.font = font;
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const testLine = current ? `${current} ${word}` : word;
    if (ctx.measureText(testLine).width <= maxWidth) {
      current = testLine;
    } else {
      if (current) {
        lines.push(current);
      }
      current = word;
    }
  }
  if (current) {
    lines.push(current);
  }
  return lines;
}

function drawLines(lines, x, y, lineHeight, font, color) {
  ctx.font = font;
  ctx.fillStyle = color;
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
}

function getPointerPosition(evt) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = WIDTH / rect.width;
  const scaleY = HEIGHT / rect.height;
  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY
  };
}

function handlePointer(evt) {
  startAudio();
  const { x, y } = getPointerPosition(evt);
  for (const button of uiButtons) {
    const { rect } = button;
    if (x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h) {
      button.onClick();
      break;
    }
  }
}

function renderTitleScreen() {
  ctx.drawImage(images.hotelBg, 0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px Courier New";
  ctx.fillText("The Chilling Case of Scott Maguire", 100, 80);
  ctx.font = "20px Courier New";
  ctx.fillText("Emma Du and Prisha Bhatia", 100, 120);
  ctx.fillText("January 5th, 2022", 100, 155);
  ctx.fillText("ICS2O7", 100, 190);

  addImageButton("start", 75, 275, 0.6, () => setScreen("animation"));
  addImageButton("exit", 420, 275, 0.6, () => setScreen("bibliography", { returnTo: "title" }));
}

function renderMenu() {
  ctx.drawImage(images.menuBg, 0, 0, WIDTH, HEIGHT);
  addImageButton("menuExit", 525, 350, 0.4, () => setScreen("bibliography", { returnTo: "title" }));
  addImageButton("menuInstructions", 100, 200, 0.4, () => setScreen("instructions"));
  addImageButton("menuQuiz", 300, 350, 0.4, () => {
    gameState.quizScore = 0;
    setScreen("quiz", { questionIndex: 0 });
  });
  addImageButton("menuBackstory", 100, 350, 0.4, () => setScreen("disclaimer"));
  addImageButton("menuReplay", 500, 185, 0.5, () => setScreen("animation"));
  addImageButton("menuPlay", 300, 200, 0.4, () => setScreen("prologue"));
}

function renderInstructions() {
  ctx.drawImage(images.bookPage, 0, 0, WIDTH, HEIGHT);
  ctx.font = "bold 32px Georgia";
  ctx.fillStyle = "#000000";
  ctx.fillText("Instructions", 295, 110);
  drawLines(instructionsLines, 120, 148, 25, "24px Georgia", "#000000");
  addImageButton("returnButton", 480, 425, 0.4, () => setScreen("menu"));
}

function renderBackstory(pageIndex) {
  const page = backstoryPages[pageIndex];
  ctx.drawImage(images.bookPage, 0, 0, WIDTH, HEIGHT);
  ctx.font = "bold 32px Georgia";
  ctx.fillStyle = "#000000";
  ctx.fillText(page.title, 295, 95);
  drawLines(page.lines, 105, 128, 25, "24px Georgia", "#000000");

  addImageButton("returnButton", 510, 5, 0.35, () => setScreen("menu"));
  if (pageIndex < backstoryPages.length - 1) {
    addImageButton("nextPage", 480, 425, 0.4, () => setScreen("backstory", { pageIndex: pageIndex + 1 }));
  }
  if (pageIndex > 0) {
    addImageButton("prevPage", 100, 425, 0.4, () => setScreen("backstory", { pageIndex: pageIndex - 1 }));
  }
}

function renderDisclaimer() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px Courier New";
  ctx.fillText("Disclaimer:", 290, 90);
  ctx.font = "25px Courier New";
  ctx.fillText("The backstory has spoilers for the game.", 100, 140);
  ctx.fillText("We recommend playing the game first.", 120, 180);
  ctx.fillText("Do you still want to continue?", 150, 220);
  addImageButton("yes", 75, 275, 0.6, () => setScreen("backstory", { pageIndex: 0 }));
  addImageButton("no", 420, 275, 0.6, () => setScreen("menu"));
}

function renderQuiz(questionIndex) {
  ctx.drawImage(images.bookPage, 0, 0, WIDTH, HEIGHT);
  const questionFont = "bold 24px Georgia";
  const optionFont = "22px Georgia";
  const maxWidth = 620;
  const startX = 110;
  let startY = 120;

  const [questionText, options] = questions[questionIndex];
  const questionLines = wrapText(questionText, questionFont, maxWidth);
  drawLines(questionLines, startX, startY, 28, questionFont, "#000000");

  startY += questionLines.length * 28 + 40;
  options.forEach((optionText, optionIndex) => {
    const label = String.fromCharCode(65 + optionIndex);
    const labeledText = `${label}. ${optionText}`;
    const optionLines = wrapText(labeledText, optionFont, maxWidth);
    drawLines(optionLines, startX, startY, 26, optionFont, "#000000");
    const buttonHeight = optionLines.length * 26;
    addButton({ x: startX, y: startY - 20, w: maxWidth, h: buttonHeight + 12 }, () => {
      if (optionIndex === correctAnswers[questionIndex]) {
        gameState.quizScore += 1;
      }
      if (questionIndex === questions.length - 1) {
        setScreen("quizResult");
      } else {
        setScreen("quiz", { questionIndex: questionIndex + 1 });
      }
    });
    startY += buttonHeight + 12;
  });
}

function renderQuizResult() {
  ctx.drawImage(images.bookPage, 0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "#000000";
  ctx.font = "bold 40px Georgia";
  ctx.fillText("Results:", 300, 140);
  ctx.font = "30px Georgia";
  ctx.fillText(`You scored ${gameState.quizScore}/8 on this quiz.`, 200, 220);
  addImageButton("returnButton", 510, 5, 0.35, () => setScreen("menu"));
}

function renderAnimation(elapsed) {
  const fps = 10;
  const frameDuration = 1 / fps;
  const animationDuration = animationFrames.length * frameDuration;
  if (elapsed < animationDuration) {
    const frameIndex = Math.floor(elapsed / frameDuration);
    ctx.drawImage(animationFrames[frameIndex], 0, 0, WIDTH, HEIGHT);
  } else if (elapsed < animationDuration + 2) {
    ctx.drawImage(animationFrames[animationFrames.length - 1], 0, 0, WIDTH, HEIGHT);
  } else if (elapsed < animationDuration + 4) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  } else {
    setScreen("menu");
  }
}

function renderPrologue(elapsed) {
  if (elapsed < 2) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  } else if (elapsed < 10.5) {
    ctx.drawImage(images.backgroundInfo, 0, 0, WIDTH, HEIGHT);
  } else {
    resetGameState();
    setScreen("play", { startTime: performance.now() });
  }
}

function getClueOverlay(clueId) {
  if (clueId === 1) {
    return [{ imgKey: "businessCard", duration: 5 }];
  }
  if (clueId === 2) {
    return [
      { imgKey: "clientList", duration: 3 },
      { imgKey: "clientListZoomed", duration: 5 }
    ];
  }
  if (clueId === 3) {
    return [
      { imgKey: "fireExit1", duration: 5 },
      { imgKey: "fireExit2", duration: 5 }
    ];
  }
  if (clueId === 4) {
    return [{ imgKey: "bodyClue", duration: 5 }];
  }
  return [{ imgKey: "woolClue", duration: 5 }];
}

function renderPlay(elapsed) {
  ctx.drawImage(images.gameBg, 0, 0, WIDTH, HEIGHT);
  const remaining = Math.max(0, Math.ceil(300 - elapsed));
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(20, 18, 170, 34);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px Georgia";
  ctx.fillText(`Time: ${remaining}s`, 30, 42);

  const overlay = screen.data.overlay;
  if (overlay) {
    const step = overlay.steps[overlay.index];
    ctx.drawImage(images[step.imgKey], 0, 0, WIDTH, HEIGHT);
    if (elapsed - overlay.startedAt >= step.duration) {
      overlay.index += 1;
      overlay.startedAt = elapsed;
      if (overlay.index >= overlay.steps.length) {
        screen.data.overlay = null;
      }
    }
    return;
  }

  clueHitboxes.forEach((clue) => {
    addButton({ x: clue.x, y: clue.y, w: clue.w, h: clue.h }, () => {
      const steps = getClueOverlay(clue.id);
      screen.data.overlay = { steps, index: 0, startedAt: elapsed };
      gameState.clues[clue.id - 1] = true;
    });
  });

  const allFound = gameState.clues.every(Boolean);
  if (allFound) {
    gameState.allFound = true;
    setScreen("alibi", { stepIndex: 0, stepStartedAt: 0 });
    return;
  }

  if (elapsed >= 300) {
    gameState.allFound = false;
    setScreen("suspect", { allFound: false });
  }
}

function renderAlibi(elapsed) {
  const alibis = ["clarkAlibi", "svenAlibi", "douglasAlibi", "maidAlibi", "ameliaAlibi"];
  const stepDuration = 7;
  const pauseDuration = 2;
  const totalDuration = alibis.length * stepDuration + pauseDuration * 2;

  if (elapsed < alibis.length * stepDuration) {
    const index = Math.floor(elapsed / stepDuration);
    ctx.drawImage(images[alibis[index]], 0, 0, WIDTH, HEIGHT);
  } else if (elapsed < alibis.length * stepDuration + pauseDuration) {
    ctx.drawImage(images[alibis[alibis.length - 1]], 0, 0, WIDTH, HEIGHT);
  } else if (elapsed < totalDuration) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  } else {
    setScreen("suspect", { allFound: true });
  }
}

function renderSuspect() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  addImageButton("ameliaName", 100, 100, 0.5, () => showEnding("amelia"));
  addImageButton("clarkName", 350, 100, 0.5, () => showEnding("clark"));
  addImageButton("douglasName", 600, 100, 0.5, () => showEnding("douglas"));
  addImageButton("maidName", 200, 310, 0.5, () => showEnding("maid"));
  addImageButton("svenName", 500, 310, 0.5, () => showEnding("sven"));
}

function showEnding(suspect) {
  const allFound = screen.data.allFound ?? gameState.allFound;
  const isCorrect = suspect === "sven";
  let endingKey = "ending4";
  if (!isCorrect && !allFound) {
    endingKey = "ending1";
  } else if (isCorrect && !allFound) {
    endingKey = "ending2";
  } else if (!isCorrect && allFound) {
    endingKey = "ending3";
  }
  setScreen("ending", { endingKey, returnAt: performance.now() + 5000 });
}

function renderEnding() {
  const endingKey = screen.data.endingKey;
  ctx.drawImage(images[endingKey], 0, 0, WIDTH, HEIGHT);
  addImageButton("returnButton", 510, 5, 0.35, () => setScreen("menu"));
  if (performance.now() >= screen.data.returnAt) {
    setScreen("menu");
  }
}

function renderBibliography(elapsed) {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px Courier New";
  ctx.fillText("Bibliography", 280, 80);
  ctx.font = "bold 20px Courier New";
  ctx.fillText(bibliographyLines[0], 25, 130);
  ctx.font = "19px Courier New";
  let y = 165;
  for (let i = 1; i < bibliographyLines.length; i += 1) {
    if (bibliographyLines[i] === "Images:") {
      ctx.font = "bold 20px Courier New";
      ctx.fillText(bibliographyLines[i], 23, y + 10);
      ctx.font = "19px Courier New";
      y += 50;
    } else {
      ctx.fillText(bibliographyLines[i], 23, y);
      y += 40;
    }
  }
  addImageButton("returnButton", 510, 5, 0.35, () => setScreen(screen.data.returnTo || "title"));
  if (elapsed >= 5) {
    setScreen(screen.data.returnTo || "title");
  }
}

function loop(now) {
  const elapsed = (now - screen.startedAt) / 1000;
  clearButtons();
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  if (screen.name === "title") {
    renderTitleScreen();
  } else if (screen.name === "menu") {
    renderMenu();
  } else if (screen.name === "instructions") {
    renderInstructions();
  } else if (screen.name === "backstory") {
    renderBackstory(screen.data.pageIndex || 0);
  } else if (screen.name === "disclaimer") {
    renderDisclaimer();
  } else if (screen.name === "quiz") {
    renderQuiz(screen.data.questionIndex || 0);
  } else if (screen.name === "quizResult") {
    renderQuizResult();
  } else if (screen.name === "animation") {
    renderAnimation(elapsed);
  } else if (screen.name === "prologue") {
    renderPrologue(elapsed);
  } else if (screen.name === "play") {
    renderPlay(elapsed);
  } else if (screen.name === "alibi") {
    renderAlibi(elapsed);
  } else if (screen.name === "suspect") {
    renderSuspect();
  } else if (screen.name === "ending") {
    renderEnding();
  } else if (screen.name === "bibliography") {
    renderBibliography(elapsed);
  } else if (screen.name === "loading") {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  requestAnimationFrame(loop);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
canvas.addEventListener("pointerdown", handlePointer);

loadAssets()
  .then(() => {
    animationFrames = frameFiles.map((name) => images[name]);
    if (loadingEl) {
      loadingEl.style.display = "none";
    }
    setScreen("title");
    requestAnimationFrame(loop);
  })
  .catch((error) => {
    if (loadingEl) {
      loadingEl.textContent = "Failed to load assets.";
    }
    console.error(error);
  });
