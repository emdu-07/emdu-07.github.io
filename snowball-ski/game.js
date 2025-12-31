(() => {
  const screenEls = Array.from(document.querySelectorAll(".screen"));
  const screenMap = new Map(screenEls.map((el) => [el.dataset.screen, el]));
  const endImage = document.querySelector(".end-image");
  const endTitle = document.getElementById("end-title");
  const endScore = document.getElementById("end-score");
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  const WIDTH = 740;
  const HEIGHT = 740;
  const keys = new Set();
  let currentScreen = "menu";

  const images = {};
  const sources = {
    hillTop: "imgs/hillTop.png",
    hill1: "imgs/hill1.jpeg",
    hill2: "imgs/hill2.jpeg",
    hill3: "imgs/hill3.jpeg",
    hill4: "imgs/hill4.jpeg",
    snowball1: "imgs/snowball1.png",
    snowball2: "imgs/snowball2.png",
    snowball3: "imgs/snowball3.png",
    snowball4: "imgs/snowball4.png",
    snowball5: "imgs/snowball5.png",
    tree: "imgs/tree.png",
    rock: "imgs/rock.png",
    splat: "imgs/splat.png",
    snowmobile: "imgs/snowmobile.png",
    snowhill: "imgs/snowhill.png",
    otherSnowball: "imgs/otherSnowball.png",
    score: "imgs/score.png",
    warning: "imgs/warning.gif",
  };

  const game = {
    started: false,
    ended: false,
    lose: false,
    paused: false,
    score: 0,
    timeLeft: 60,
    topY: 0,
    hillY: 0,
    sX: 200,
    sY: 200,
    sW: 40,
    sH: 40,
    tickInterval: 100,
    accum: 0,
    scoreAccum: 0,
    lastFrame: 0,
    startTime: 0,
    endTime: 0,
    sfNum: 1,
    bgfNum: 1,
    obstacles: [],
    snowPiles: [],
    ices: [],
    warnSignStatus: false,
    snowmobile: false,
    warningSignStartTime: 0,
    snowmobileX: 0,
    snowmobileY: 0,
    vX: 10,
    vY: 0,
    warnY: 0,
    rivalSnowball: false,
    rivalSnowballStartTime: 0,
    rivalX: 0,
    rivalY: 0,
    rivalSize: 0,
  };

  const bgFrames = () => [images.hill1, images.hill2, images.hill3, images.hill4];
  const snowballFrames = () => [
    images.snowball1,
    images.snowball2,
    images.snowball3,
    images.snowball4,
    images.snowball5,
  ];

  const showScreen = (name) => {
    currentScreen = name;
    screenEls.forEach((el) => el.classList.remove("active"));
    const target = screenMap.get(name);
    if (target) {
      target.classList.add("active");
    }
  };

  const loadImages = (cb) => {
    const entries = Object.entries(sources);
    let loaded = 0;
    entries.forEach(([key, src]) => {
      const img = new Image();
      img.onload = () => {
        loaded += 1;
        if (loaded === entries.length) {
          cb();
        }
      };
      img.onerror = () => {
        loaded += 1;
        if (loaded === entries.length) {
          cb();
        }
      };
      img.src = src;
      images[key] = img;
    });
  };

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const loadObstacle = () => {
    const isRock = Math.random() < 0.33;
    const x = rand(0, 701);
    game.obstacles.push({
      type: isRock ? "rock" : "tree",
      x,
      y: HEIGHT,
      w: isRock ? 30 : 25,
      h: isRock ? 30 : 40,
    });
  };

  const loadSnowPile = () => {
    game.snowPiles.push({
      value: rand(20, 27),
      x: rand(0, 701),
      y: HEIGHT,
    });
  };

  const loadIce = () => {
    game.ices.push({
      len: rand(1, 2) * 200,
      x: rand(0, 701),
      y: HEIGHT,
    });
  };

  const collides = (x1, y1, w1, h1, x2, y2, w2, h2) =>
    x1 > x2 - w1 && x1 < x2 + w2 && y1 < y2 + h1 && y1 > y2 - h2;

  const touchingIce = () =>
    game.ices.some((ice) => {
      const withinX =
        (game.sX >= ice.x && game.sX <= ice.x + 30) ||
        (game.sX + 40 >= ice.x && game.sX + 40 <= ice.x + 30) ||
        (game.sX + 20 >= ice.x && game.sX + 20 <= ice.x + 30);
      const withinY = game.sY + 40 >= ice.y && game.sY + 40 <= ice.y + ice.len;
      return withinX && withinY;
    });

  const resetGame = () => {
    game.started = true;
    game.ended = false;
    game.lose = false;
    game.paused = false;
    game.score = 0;
    game.timeLeft = 60;
    game.topY = 0;
    game.hillY = 0;
    game.sX = 200;
    game.sY = 200;
    game.tickInterval = 100;
    game.accum = 0;
    game.scoreAccum = 0;
    game.startTime = performance.now();
    game.endTime = 0;
    game.sfNum = 1;
    game.bgfNum = 1;
    game.obstacles = [];
    game.snowPiles = [];
    game.ices = [];
    game.warnSignStatus = false;
    game.snowmobile = false;
    game.warningSignStartTime = 0;
    game.snowmobileX = 0;
    game.snowmobileY = 0;
    game.vX = 10;
    game.vY = 0;
    game.warnY = 0;
    game.rivalSnowball = false;
    game.rivalSnowballStartTime = 0;
    game.rivalX = rand(0, 701);
    game.rivalY = 0;
    game.rivalSize = rand(4, 8) * 9;
    loadObstacle();
    loadSnowPile();
    loadIce();
  };

  const update = (stepMs, now) => {
    if (!game.started || game.ended || game.paused) {
      return;
    }

    game.timeLeft = 60 - (now - game.startTime) / 1000;
    if (game.timeLeft <= 0 && !game.ended) {
      game.timeLeft = 0;
      game.ended = true;
      game.endTime = now;
      return;
    }

    if (!game.lose && game.tickInterval !== 25) {
      game.scoreAccum += stepMs;
      if (game.scoreAccum >= 250) {
        const points = Math.floor(game.scoreAccum / 250);
        game.score += points;
        game.scoreAccum %= 250;
      }
    }

    game.topY -= 10;
    if (game.topY > -HEIGHT) {
      game.hillY = game.topY + 350;
    } else {
      game.hillY = 0;
    }
    game.bgfNum = (game.bgfNum + 1) % 4;
    game.sfNum = (game.sfNum + 1) % snowballFrames().length;

    if (Math.random() < 0.33) {
      loadObstacle();
    }

    game.obstacles = game.obstacles.filter((obs) => {
      obs.y -= 10;
      if (collides(game.sX, game.sY, game.sW, game.sH, obs.x, obs.y, obs.w, obs.h)) {
        game.lose = true;
      }
      return obs.y >= 0;
    });

    for (let i = 0; i < game.snowPiles.length; ) {
      const pile = game.snowPiles[i];
      let touch = game.sX >= pile.x && game.sX <= pile.x + 75;
      touch = touch || (game.sX + 40 >= pile.x && game.sX + 40 <= pile.x + 75);
      touch =
        touch &&
        ((game.sY >= pile.y && game.sY <= pile.y + 45) ||
          (game.sY + 40 >= pile.y && game.sY + 40 <= pile.y + 45));
      if (touch && !game.lose) {
        game.score += pile.value;
        game.snowPiles.splice(i, 1);
        loadSnowPile();
      } else if (pile.y < 0) {
        game.snowPiles.splice(i, 1);
        loadSnowPile();
      } else {
        pile.y -= 10;
        if (game.snowPiles[game.snowPiles.length - 1].y < 400) {
          loadSnowPile();
        }
        i += 1;
      }
    }

    game.tickInterval = touchingIce() ? 25 : 100;

    for (let i = 0; i < game.ices.length; i += 1) {
      const ice = game.ices[i];
      ice.y -= 20;
      if (ice.y + ice.len < 0) {
        game.ices.splice(i, 1);
        loadIce();
        i -= 1;
      } else {
        ice.y -= 10;
      }
    }

    if (!game.rivalSnowball && Math.random() < 0.05) {
      game.rivalSnowballStartTime = now - game.startTime;
      game.rivalSnowball = true;
    }

    if (game.rivalSnowball) {
      const collision = collides(
        game.rivalX,
        game.rivalY,
        game.rivalSize,
        game.rivalSize,
        game.sX,
        game.sY,
        game.sW,
        game.sH
      );
      if (collision) {
        if (game.rivalSize >= game.sW) {
          game.lose = true;
        } else {
          game.score += game.rivalSize;
        }
        game.rivalSnowball = false;
        game.rivalX = rand(0, 701);
        game.rivalY = 0;
        game.rivalSize = rand(4, 8) * 9;
      } else if (now - game.startTime - game.rivalSnowballStartTime >= 4000) {
        game.rivalY -= 10;
        if (game.rivalY < -game.rivalSize) {
          game.rivalSnowball = false;
          game.rivalX = rand(0, 701);
          game.rivalY = 0;
          game.rivalSize = rand(4, 8) * 9;
        }
      } else {
        game.rivalY += 10;
      }
    }

    if (!game.warnSignStatus && !game.snowmobile && Math.random() < 0.02) {
      game.warningSignStartTime = now - game.startTime;
      game.warnSignStatus = true;
      game.warnY = rand(100, 701);
    }

    if (game.warnSignStatus && now - game.startTime - game.warningSignStartTime >= 3000) {
      game.warnSignStatus = false;
      game.snowmobile = true;
      game.snowmobileX = 700;
      game.snowmobileY = game.warnY;
    }

    if (game.snowmobile) {
      for (const obs of game.obstacles) {
        if (collides(game.snowmobileX, game.snowmobileY, 50, 24, obs.x, obs.y, obs.w, obs.h)) {
          game.vY = rand(-5, 5) * 2;
        }
      }
      game.snowmobileX -= game.vX;
      game.snowmobileY -= game.vY;

      if (collides(game.sX, game.sY, game.sW, game.sH, game.snowmobileX, game.snowmobileY, 50, 24)) {
        game.lose = true;
      }

      if (game.snowmobileX < -20) {
        game.snowmobile = false;
      }
    }

    if (game.lose && !game.ended) {
      game.ended = true;
      game.endTime = now;
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    if (game.topY + HEIGHT > 0) {
      ctx.fillStyle = "#bef0ff";
      ctx.fillRect(0, 0, WIDTH, 400);
      const bgImg = bgFrames()[game.bgfNum];
      if (bgImg) {
        ctx.drawImage(bgImg, 0, game.hillY + 710, WIDTH, HEIGHT);
      }
    }

    if (images.hillTop) {
      ctx.drawImage(images.hillTop, 0, game.topY, WIDTH, HEIGHT);
    }
    const hillImg = bgFrames()[game.bgfNum];
    if (hillImg) {
      ctx.drawImage(hillImg, 0, game.hillY, WIDTH, HEIGHT);
    }

    ctx.fillStyle = "#ccffff";
    game.ices.forEach((ice) => {
      ctx.fillRect(ice.x, ice.y, 30, ice.len);
    });

    game.snowPiles.forEach((pile) => {
      if (images.snowhill) {
        ctx.drawImage(images.snowhill, pile.x, pile.y, 75, 45);
      }
      ctx.fillStyle = "#1c6bd6";
      ctx.font = '20px "Chivo Mono"';
      ctx.fillText(String(pile.value), pile.x + 30, pile.y - 5);
    });

    game.obstacles.forEach((obs) => {
      const img = obs.type === "rock" ? images.rock : images.tree;
      if (img) {
        ctx.drawImage(img, obs.x, obs.y, obs.w, obs.h);
      }
    });

    if (game.rivalSnowball && images.otherSnowball) {
      ctx.drawImage(
        images.otherSnowball,
        game.rivalX,
        game.rivalY,
        game.rivalSize,
        game.rivalSize
      );
    }

    if (game.warnSignStatus && images.warning) {
      ctx.drawImage(images.warning, 700, game.warnY, 40, 40);
    }

    if (game.snowmobile && images.snowmobile) {
      ctx.drawImage(images.snowmobile, game.snowmobileX, game.snowmobileY, 50, 24);
    }

    ctx.fillStyle = "#e6ffff";
    ctx.fillRect(10, 10, 190, 70);
    if (images.score) {
      ctx.drawImage(images.score, 20, 15, 100, 30);
    }
    ctx.font = '27px "Chivo Mono"';
    ctx.fillStyle = "#007aa6";
    ctx.fillText(String(game.score), 140, 39);

    const timeDisplay = game.timeLeft > 9 ? `00:${Math.floor(game.timeLeft)}` : `00:0${Math.floor(game.timeLeft)}`;
    if (game.timeLeft <= 5) {
      ctx.fillStyle = "#e04848";
    }
    ctx.fillText(timeDisplay, 100, 70);
    ctx.fillStyle = "#007aa6";
    ctx.font = '27px "Chivo Mono"';
    ctx.fillText("Time:", 20, 70);

    if (!game.lose) {
      const frame = snowballFrames()[game.sfNum];
      if (frame) {
        ctx.drawImage(frame, game.sX, game.sY, game.sW, game.sH);
      }
    } else if (images.splat) {
      ctx.drawImage(images.splat, game.sX, game.sY, 54, 40);
    }

    if (game.paused) {
      ctx.fillStyle = "rgba(0, 40, 80, 0.55)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = "#f7fbff";
      ctx.font = '36px "Chivo Mono"';
      ctx.textAlign = "center";
      ctx.fillText("Paused", WIDTH / 2, HEIGHT / 2 - 10);
      ctx.font = '18px "Chivo Mono"';
      ctx.fillText("Press P to resume", WIDTH / 2, HEIGHT / 2 + 24);
      ctx.textAlign = "start";
    }
  };

  const loop = (timestamp) => {
    if (!game.lastFrame) {
      game.lastFrame = timestamp;
    }
    const delta = timestamp - game.lastFrame;
    game.lastFrame = timestamp;

    if (currentScreen === "game") {
      if (!game.ended && !game.paused) {
        game.accum += delta;
        while (game.accum >= game.tickInterval) {
          update(game.tickInterval, timestamp);
          game.accum -= game.tickInterval;
        }
      }
      draw();

      if (game.ended && game.endTime && timestamp - game.endTime >= 3000) {
        endTitle.textContent = game.lose ? "You Lost" : "You Won";
        endScore.textContent = `Your Score: ${game.score}`;
        endImage.style.backgroundImage = `url("imgs/${game.lose ? "youLost" : "youWon"}.png")`;
        showScreen("end");
      }
    }

    requestAnimationFrame(loop);
  };

  const handleMove = (key) => {
    if (game.ended || game.lose || game.paused) {
      return;
    }
    if (key === "ArrowLeft" || key === "a") {
      if (game.sX > 0) game.sX -= 20;
    } else if (key === "ArrowRight" || key === "d") {
      if (game.sX < 700) game.sX += 20;
    } else if (key === "ArrowUp" || key === "w") {
      if (game.sY > 0) game.sY -= 20;
    } else if (key === "ArrowDown" || key === "s") {
      if (game.sY < 680) game.sY += 20;
    }
  };

  const onAction = (action) => {
    if (action === "start") {
      resetGame();
      showScreen("game");
    } else if (action === "menu") {
      showScreen("menu");
    } else if (action === "instr-1") {
      showScreen("instr-1");
    } else if (action === "instr-2") {
      showScreen("instr-2");
    } else if (action === "restart") {
      resetGame();
      showScreen("game");
    }
  };

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (target) {
      onAction(target.dataset.action);
    }
  });

  window.addEventListener("keydown", (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (key === "p" && currentScreen === "game" && !game.ended) {
      game.paused = !game.paused;
      return;
    }
    if (!keys.has(key)) {
      keys.add(key);
      handleMove(key);
    }
  });

  window.addEventListener("keyup", (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    keys.delete(key);
  });

  loadImages(() => {
    requestAnimationFrame(loop);
  });
})();
