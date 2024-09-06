const Game = (() => {
  // Centralized game state
  const state = {
    player1Score: 0,
    player2Score: 0,
    serveToPlayer1: Math.random() < 0.5,
    gameActive: false,
    canvas: null,
    context: null,
  };

  // Game initialization
  function initCanvas() {
    state.canvas = document.getElementById("pongCanvas");
    if (!state.canvas) console.error("Canvas element not found");

    state.context = state.canvas.getContext("2d");
    state.canvas.width = 800;
    state.canvas.height = 600;
  }

  function updateScore() {
    const scoreElement = document.getElementById("score");
    if (!state.gameActive) {
      scoreElement.textContent = "Game ready to be started";
    } else if (scoreElement) {
      scoreElement.textContent = `${state.player1Score} - ${state.player2Score}`;
    } else {
      console.error("Score element not found");
    }
  }

  const player1 = {
    x: 0,
    y: state.canvas ? state.canvas.height / 2 - 100 / 2 : 0, // paddleHeight = 100
    width: 10,
    height: 100,
    dy: 5,
  };

  const player2 = {
    x: state.canvas ? state.canvas.width - 10 : 0, // paddleWidth = 10
    y: state.canvas ? state.canvas.height / 2 - 100 / 2 : 0,
    width: 10,
    height: 100,
    dy: 5,
  };

  const ball = {
    x: state.canvas ? state.canvas.width / 2 : 0,
    y: state.canvas ? state.canvas.height / 2 : 0,
    radius: 10,
    speed: 4,
    dx: 4,
    dy: 4,
  };

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
    ball.x += ball.dx;
    ball.y += ball.dy;

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

    // Ball collision with paddles
    if (ball.x - ball.radius < player1.x + player1.width && ball.y > player1.y && ball.y < player1.y + player1.height) {
      ball.dx *= -1;
    }
    if (ball.x + ball.radius > player2.x && ball.y > player2.y && ball.y < player2.y + player2.height) {
      ball.dx *= -1;
    }
  }

  function movePaddle(paddle, upKey, downKey) {
    if (upKey && paddle.y > 0) {
      paddle.y -= paddle.dy;
    } else if (downKey && paddle.y < state.canvas.height - paddle.height) {
      paddle.y += paddle.dy;
    }
  }

  // Start or reset the ball's position
  function resetBall() {
    ball.x = state.canvas.width / 2;
    ball.y = state.canvas.height * (0.25 + Math.random() * 0.5); // Random y between 0.25 and 0.75 of canvas height
    ball.dx = state.serveToPlayer1 ? 4 : -4; // Serve direction
    ball.dy = (Math.random() < 0.5 ? -1 : 1) * Math.abs(ball.dy);
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

    drawPaddle(player1.x, player1.y, player1.width, player1.height);
    drawPaddle(player2.x, player2.y, player2.width, player2.height);

    if (state.gameActive) {
      drawBall(ball.x, ball.y, ball.radius);
      moveBall();
    }

    movePaddle(player1, state.wPressed, state.sPressed);
    movePaddle(player2, state.upPressed, state.downPressed);
    requestAnimationFrame(draw);
  }

  function startGame() {
    state.gameActive = true;
    resetBall();
    updateScore(); // Initial score update
    document.getElementById("pongCanvas").classList.remove("blurred");
    document.getElementById("overlay").style.display = "none";
    draw(); // Start the game loop
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
    initCanvas(); // Initialize the game canvas
    player1.y = state.canvas.height / 2 - player1.height / 2;
    player2.x = state.canvas.width - player2.width;
    player2.y = state.canvas.height / 2 - player2.height / 2;
    updateScore(); // Set initial game status
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
  }

  return {
    startGame,
    setupGame,
    initCanvas,
    updateScore,
    draw,
    resetBall,
    state, // Expose the state object if needed
  };
})();
