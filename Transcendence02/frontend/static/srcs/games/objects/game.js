const Game = (() => {
  // Centralized game state
  let animationFrameId;
  let state = { ...GameDefaults.state };
  let player1 = { ...GameDefaults.player1 };
  let player2 = { ...GameDefaults.player2 };
  let ball = { ...GameDefaults.ball };
  let paddle = { ...GameDefaults.paddle };

  // AI GAME

  let lastPredictionTime = 0;
  let predictedY = 0;

  function predictY() {
    // Time for ball to reach the AI paddle
    const timeToReachPaddle = (player1.x + paddle.width - ball.x) / Math.abs(ball.dx);

    // Predict ball's Y position when it reaches the AI paddle
    let predictedY = ball.y + ball.dy * ball.speed * timeToReachPaddle;

    // Handle wall bounces
    if (predictedY - ball.radius < 0) {
      predictedY = ball.radius + (ball.radius - predictedY);
    } else if (predictedY + ball.radius > state.canvas.height) {
      predictedY = state.canvas.height - ball.radius - (predictedY - (state.canvas.height - ball.radius));
    }

    return predictedY;
  }

  // Move the AI paddle based on the predicted ball position
  function moveAIPaddle() {
    const currentTime = Date.now();
    if (currentTime - lastPredictionTime >= 1000) {
      // Adjust prediction frequency as needed
      predictedY = predictY();
      lastPredictionTime = currentTime;
    }

    const paddleCenterY = player1.y + paddle.height / 2;
    const movementThreshold = 0; // Minimum distance to start moving

    if (predictedY < paddleCenterY - movementThreshold) {
      return "w";
    } else if (predictedY > paddleCenterY + movementThreshold) {
      return "s";
    }

    return "";
  }
  // GAME

  function resetBall() {
    ball.x = state.canvas ? state.canvas.width / 2 : 0;
    ball.y = state.canvas ? state.canvas.height * (0.25 + Math.random() * 0.5) : 0;
    ball.dx = state.serveToPlayer1 ? 1 : -1;
    ball.dy = (Math.random() < 0.5 ? -1 : 1) * 0.5;
  }

  // Game initialization
  function resetValues() {
    state.playAgainstAI = false;
    state.pointsToWin = GameDefaults.state.pointsToWin;
    state.player1Score = GameDefaults.state.player1Score;
    state.player2Score = GameDefaults.state.player2Score;
    state.serveToPlayer1 = GameDefaults.state.serveToPlayer1;

    player1 = {
      x: 0,
      y: state.canvas ? state.canvas.height / 2 - paddle.height / 2 : 0,
    };

    player2 = {
      x: state.canvas ? state.canvas.width - paddle.width : 0,
      y: state.canvas ? state.canvas.height / 2 - paddle.height / 2 : 0,
    };

    resetBall();
  }

  function initCanvas() {
    state.canvas = document.getElementById("pongCanvas");
    if (!state.canvas) console.error("Canvas element not found");

    state.context = state.canvas.getContext("2d");
    state.canvas.width = 800;
    state.canvas.height = 600;

    // Initialize paddle positions
    player1.x = 0;
    player1.y = state.canvas.height / 2 - paddle.height / 2;
    player2.x = state.canvas.width - paddle.width;
    player2.y = state.canvas.height / 2 - paddle.height / 2;
  }

  function updateScore() {
    const scoreElement = document.getElementById("score");
    const player1Element = document.getElementById("player1");
    const player2Element = document.getElementById("player2");
    if (!state.gameActive) {
      player1Element.textContent = "";
      scoreElement.textContent = "Game ready to be started";
      player2Element.textContent = "";
    } else if (scoreElement) {
      player1Element.textContent = state.playAgainstAI ? "AI" : "Other player";
      scoreElement.textContent = `${state.player1Score} - ${state.player2Score}`;
      player2Element.textContent = "You";
    } else {
      console.error("Score element not found");
    }
  }

  // Drawing functions
  function drawPaddle(x, y, width, height) {
    state.context.fillStyle = "#FFF";
    state.context.fillRect(x, y, width, height);
  }

  function drawBall(x, y, radius) {
    state.context.beginPath();
    state.context.arc(x, y, radius, 0, Math.PI * 2);
    state.context.fillStyle = "#FFF";
    state.context.fill();
    state.context.closePath();
  }

  // Core game logic
  function moveBall() {
    ball.x += ball.dx * ball.speed;
    ball.y += ball.dy * ball.speed;

    // Ball collision with top/bottom walls
    if (ball.y + ball.radius > state.canvas.height || ball.y - ball.radius < 0) {
      ball.dy *= -1;
    }

    // Ball goes out of bounds (left/right)
    if (ball.x - ball.radius < 0) {
      state.serveToPlayer1 = true;
      state.player2Score++;
      updateScore();
      resetBall();
    } else if (ball.x + ball.radius > state.canvas.width) {
      state.serveToPlayer1 = false;
      state.player1Score++;
      updateScore();
      resetBall();
    }

    if (state.player1Score === state.pointsToWin || state.player2Score === state.pointsToWin) {
      const opponent = state.playAgainstAI ? "AI" : "Player 2";
      uploadMatch(opponent, state.playAgainstAI, state.player1Score, state.player2Score);
      document.getElementById("gamePauseStopButtons").style.opacity = "0";
      stopGame();
      return;
    }

    // Ball collision with paddles
    if (ball.x - ball.radius < player1.x + paddle.width && ball.y > player1.y && ball.y < player1.y + paddle.height) {
      ball.dx *= -1;
    }
    if (ball.x + ball.radius > player2.x && ball.y > player2.y && ball.y < player2.y + paddle.height) {
      ball.dx *= -1;
    }
  }

  function movePaddle(player, upKey, downKey) {
    if (upKey && player.y > 0) {
      player.y -= paddle.dy;
    } else if (downKey && player.y < state.canvas.height - paddle.height) {
      player.y += paddle.dy;
    }
  }

  // Main game loop
  function draw() {
    state.context.clearRect(0, 0, state.canvas.width, state.canvas.height);

    // Draw middle line
    const middleX = state.canvas.width / 2;
    state.context.strokeStyle = "#FFF";
    state.context.lineWidth = 2;
    state.context.setLineDash([5, 15]);

    state.context.beginPath();
    state.context.moveTo(middleX, 0);
    state.context.lineTo(middleX, state.canvas.height);
    state.context.stroke();

    drawPaddle(player1.x, player1.y, paddle.width, paddle.height);
    drawPaddle(player2.x, player2.y, paddle.width, paddle.height);

    if (state.gameActive) {
      drawBall(ball.x, ball.y, ball.radius);
      moveBall();
    }

    if (state.playAgainstAI) {
      const key = moveAIPaddle();
      let event = new KeyboardEvent("keydown", { key });
      document.dispatchEvent(event);
      movePaddle(player1, state.wPressed, state.sPressed); // Move player1 with keys
      event = new KeyboardEvent("keyup", { key });
      document.dispatchEvent(event);
    } else {
      movePaddle(player1, state.wPressed, state.sPressed); // Move player1 with keys
    }

    movePaddle(player2, state.upPressed, state.downPressed);
    animationFrameId = requestAnimationFrame(draw);
  }

  function startGame() {
    document.getElementById("snextGameButton").style.opacity = "0";
    document.getElementById("gamePauseStopButtons").style.opacity = "1";
    document.getElementById("tournament-next").style.opacity = "0";
    cancelAnimationFrame(animationFrameId);
    resetValues();
    state.gameActive = true;
    resetBall();
    updateScore(); // Initial score update
    document.getElementById("pongCanvas").classList.remove("blurred");
    document.getElementById("gamePauseStopButtons").style.display = "block";
    document.getElementById("overlay").style.display = "none";
    draw(); // Start the game loop
  }

  function stopGame() {
    cancelAnimationFrame(animationFrameId);
    state.player1Score = GameDefaults.state.player1Score;
    state.player2Score = GameDefaults.state.player2Score;
    state.serveToPlayer1 = GameDefaults.state.serveToPlayer1;
    state.gameActive = GameDefaults.state.gameActive;

    document.getElementById("pongCanvas").classList.add("blurred");
    document.getElementById("overlay").style.display = "block";
    document.getElementById("gamePauseStopButtons").style.display = "none";
    document.getElementById("overlay").textContent = "Pong game";
    updateScore();
  }

  function handleKeyDown(event) {
    if (event.key === "p") {
      state.upPressed = true;
    } else if (event.key === "l") {
      state.downPressed = true;
    } else if (event.key === "w") {
      state.wPressed = true;
    } else if (event.key === "s") {
      state.sPressed = true;
    }
  }

  function handleKeyUp(event) {
    if (event.key === "p") {
      state.upPressed = false;
    } else if (event.key === "l") {
      state.downPressed = false;
    } else if (event.key === "w") {
      state.wPressed = false;
    } else if (event.key === "s") {
      state.sPressed = false;
    }
  }

  function setupGame() {
    document.getElementById("gamePauseStopButtons").style.opacity = "0";
    initCanvas(); // Initialize the game canvas
    updateScore(); // Set initial game status
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
  }

  function pauseGame() {
    if (state.gameActive) {
      state.gamePaused = !state.gamePaused;
      if (state.gamePaused) {
        cancelAnimationFrame(animationFrameId);
        document.getElementById("pongCanvas").classList.add("blurred");
        document.getElementById("overlay").style.display = "block";
        document.getElementById("overlay").textContent = "Paused";
      } else {
        document.getElementById("pongCanvas").classList.remove("blurred");
        document.getElementById("overlay").style.display = "none";
        document.getElementById("startNextGameButton").style.display = "none";
        draw();
      }
    }
  }

  return {
    movePaddle,
    startGame,
    setupGame,
    initCanvas,
    updateScore,
    draw,
    resetBall,
    stopGame,
    pauseGame,
    state,
    player1,
    ball,
    paddle,
  };
})();

async function uploadMatch(opponent, playAgainstAI, player1Score, player2Score) {
  const response = await fetch("https://localhost:8000/api/upload-match/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: sessionStorage.getItem("username"),
      opponent: opponent,
      playAgainstAI: playAgainstAI,
      player1Score: player1Score,
      player2Score: player2Score,
    }),
  });

  const data = await response.json();
  if (data.status === "success") {
    console.log("Match uploaded successfully:", data.match_id);
  } else {
    console.error("Error uploading match:", data.message);
  }
}
