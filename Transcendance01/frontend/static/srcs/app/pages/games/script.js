function updateScore(gameActive) {
  const scoreElement = document.getElementById("score");
  if (!gameActive) {
    scoreElement.textContent = "Game ready to be started";
  } else if (scoreElement) {
    scoreElement.textContent = `${player1Score} - ${player2Score}`;
  } else {
    console.error("Score element not found");
  }
}

function canvasDisplay() {
  const canvas = document.getElementById("pongCanvas");
  if (!canvas) console.error("Canvas element not found");

  const context = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 600;

  let player1Score = 0;
  let player2Score = 0;
  let serveToPlayer1 = Math.random() < 0.5;
  let gameActive = false; // Track if the game is active

  const paddleWidth = 10;
  const paddleHeight = 100;
  const ballRadius = 10;

  let upPressed = false;
  let downPressed = false;
  let wPressed = false;
  let sPressed = false;

  const player1 = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 5,
  };

  const player2 = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 5,
  };

  const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    speed: 4,
    dx: 4,
    dy: 4,
  };

  function drawPaddle(x, y, width, height) {
    context.fillStyle = "#FFF";
    context.fillRect(x, y, width, height);
  }

  function drawBall(x, y, radius) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = "#FFF";
    context.fill();
    context.closePath();
  }

  function movePaddle(paddle, upKey, downKey) {
    if (upKey && paddle.y > 0) {
      paddle.y -= paddle.dy;
    } else if (downKey && paddle.y < canvas.height - paddle.height) {
      paddle.y += paddle.dy;
    }
  }

  function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
      ball.dy *= -1;
    }

    if (ball.x - ball.radius < 0) {
      serveToPlayer1 = true;
      player2Score++;
      updateScore();
      resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
      serveToPlayer1 = false;
      player1Score++;
      updateScore();
      resetBall();
    }

    if (ball.x - ball.radius < player1.x + player1.width && ball.y > player1.y && ball.y < player1.y + player1.height) {
      ball.dx *= -1;
    }

    if (ball.x + ball.radius > player2.x && ball.y > player2.y && ball.y < player2.y + player2.height) {
      ball.dx *= -1;
    }
  }

  function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height * (0.25 + Math.random() * 0.5); // Random y between 0.25 and 0.75 of canvas height

    // Randomize the orientation of the ball's movement
    ball.dx = (serveToPlayer1 < 0.5 ? -1 : 1) * Math.abs(ball.dx);
    ball.dy = (Math.random() < 0.5 ? -1 : 1) * Math.abs(ball.dy);
  }

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a vertical line at the middle of the canvas
    const middleX = canvas.width / 2;
    context.strokeStyle = "#FFF"; // Set the color of the line
    context.lineWidth = 2; // Set the width of the line
    context.lineCap = "round"; // Set the end of the line
    context.setLineDash([5, 15]); // Set the pattern of the line

    context.beginPath();
    context.moveTo(middleX, 0);
    context.lineTo(middleX, canvas.height);
    context.stroke();

    drawPaddle(player1.x, player1.y, player1.width, player1.height);
    drawPaddle(player2.x, player2.y, player2.width, player2.height);

    if (gameActive) {
      drawBall(ball.x, ball.y, ball.radius);
      moveBall();
    }

    movePaddle(player1, wPressed, sPressed);
    movePaddle(player2, upPressed, downPressed);

    requestAnimationFrame(draw);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      upPressed = true;
    } else if (event.key === "ArrowDown") {
      downPressed = true;
    } else if (event.key === "w") {
      wPressed = true;
    } else if (event.key === "s") {
      sPressed = true;
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowUp") {
      upPressed = false;
    } else if (event.key === "ArrowDown") {
      downPressed = false;
    } else if (event.key === "w") {
      wPressed = false;
    } else if (event.key === "s") {
      sPressed = false;
    }
  });

  updateScore(); // Initial call to display the initial score
  draw();
}

function startGame() {
  gameActive = true;
  document.getElementById("pongCanvas").classList.remove("blurred");
  document.getElementById("overlay").style.display = "none";
  updateScore(); // Initial call to display the initial score
}
