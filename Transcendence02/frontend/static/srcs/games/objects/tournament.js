const Tournament = (() => {
  let players = [];
  let currentMatch = [];
  let nextMatch = [];

  // Centralized game state
  let animationFrameId;
  let state = { ...GameDefaults.state };
  let player1 = { ...GameDefaults.player1 };
  let player2 = { ...GameDefaults.player2 };
  let ball = { ...GameDefaults.ball };
  let paddle = { ...GameDefaults.paddle };

  function resetBall() {
    ball.x = state.canvas ? state.canvas.width / 2 : 0;
    ball.y = state.canvas ? state.canvas.height * (0.25 + Math.random() * 0.5) : 0;
    ball.dx = state.serveToPlayer1 ? 1 : -1;
    ball.dy = (Math.random() < 0.5 ? -1 : 1) * 0.5;
  }

  // Game initialization
  function resetValues() {
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
    if (!state.gameActive) {
      scoreElement.textContent = "Game ready to be started";
    } else if (scoreElement) {
      scoreElement.textContent = `${state.player1Score} - ${state.player2Score}`;
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
      const playerWon = state.player1Score === state.pointsToWin ? currentMatch[0] : currentMatch[1];
      const playerLoose = state.player1Score === state.pointsToWin ? currentMatch[1] : currentMatch[0];
      const player1Score = state.player1Score;
      const player2Score = state.player2Score;
      stopGame();
      console.log("players", players);
      if (players.size == 2) {
        document.getElementById("overlay").style.display = "block";
        document.getElementById("overlay").textContent = `${playerWon} won the tournament`;
        document.getElementById("gamePauseStopButtons").style.opacity = "0";
      } else {
        document.getElementById("overlay").style.display = "block";
        document.getElementById("overlay").textContent = `${currentMatch[0]}:${player1Score} - ${currentMatch[1]}:${player2Score}`;
        document.getElementById("snextGameButton").style.display = "block";

        if (players.size == 3) {
          document.getElementById("snextGameButton").textContent = `Last match: ${playerWon} vs ${nextMatch[0]}`;
          currentMatch = [playerWon, nextMatch[0]];
          nextMatch = [];
          players.delete(playerLoose);
        } else {
          console.log("HEre");
          document.getElementById("snextGameButton").textContent = `Next match: ${nextMatch[0]} vs ${nextMatch[1]}`;
          players.delete(playerLoose);
          benchMatching();
        }
      }
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

    movePaddle(player1, state.wPressed, state.sPressed); // Move player1 with keys

    movePaddle(player2, state.upPressed, state.downPressed);
    animationFrameId = requestAnimationFrame(draw);
  }

  function startGame() {
    document.getElementById("gamePauseStopButtons").style.opacity = "1";
    cancelAnimationFrame(animationFrameId);
    resetValues();
    state.gameActive = true;
    resetBall();
    updateScore(); // Initial score update
    document.getElementById("pongCanvas").classList.remove("blurred");
    document.getElementById("gamePauseStopButtons").style.display = "block";
    document.getElementById("overlay").style.display = "none";
    document.getElementById("player1").textContent = currentMatch[0];
    document.getElementById("player2").textContent = currentMatch[1];
    console.log("nextMatch", nextMatch);
    document.getElementById("tournament-next").textContent = nextMatch.length > 0 ? `${nextMatch[0]} vs ${nextMatch[1]}` : "No more matches";
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

  function startTournament(playerList) {
    document.getElementById("snextGameButton").style.opacity = "1";
    document.getElementById("tournament-next").style.opacity = "1";
    currentMatch = [];
    nextMatch = [];
    players = playerList;
    benchMatching();
  }

  function getTwoRandomPlayers(playerSet) {
    if (playerSet.length < 2) {
      return null; // or handle the case where there are not enough players
    }

    const firstIndex = Math.floor(Math.random() * playerSet.length);
    let secondIndex;
    do {
      secondIndex = Math.floor(Math.random() * playerSet.length);
    } while (secondIndex === firstIndex);
    return [playerSet[firstIndex], playerSet[secondIndex]];
  }

  function benchMatching() {
    const newPlayers = new Set(players);

    currentMatch = [];
    nextMatch = [];
    currentMatch = getTwoRandomPlayers([...players]);
    console.log(players, "currentMatch", currentMatch);
    newPlayers.delete(currentMatch[0]);
    newPlayers.delete(currentMatch[1]);
    if (players.size >= 4) {
      nextMatch = getTwoRandomPlayers([...newPlayers]);
    }
    if (players.size == 3) nextMatch[0] = newPlayers.values().next().value;
  }

  function setupGame() {
    document.getElementById("gamePauseStopButtons").style.opacity = "0";
    initCanvas(); // Initialize the game canvas
    updateScore(); // Set initial game status
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
  }

  return {
    ball,
    paddle,
    state,
    startGame,
    setupGame,
    startTournament,
  };
})();
