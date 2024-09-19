const GameDefaults = (() => {
  const paddle = {
    width: 10,
    height: 100,
    dy: 5,
  };

  const state = {
    pointsToWin: 5,
    player1Score: 0,
    player2Score: 0,
    gamePaused: false,
    serveToPlayer1: Math.random() < 0.5,
    gameActive: false,
    canvas: null,
    context: null,
    playAgainstAI: false,
    upPressed: false,
    downPressed: false,
    wPressed: false,
    sPressed: false,
  };

  const player1 = {
    x: 0,
    y: state.canvas ? state.canvas.height / 2 - paddle.height / 2 : 0,
  };

  const player2 = {
    x: state.canvas ? state.canvas.width - paddle.width : 0,
    y: state.canvas ? state.canvas.height / 2 - paddle.height / 2 : 0,
  };

  const ball = {
    x: state.canvas ? state.canvas.width / 2 : 0,
    y: state.canvas ? state.canvas.height * (0.25 + Math.random() * 0.5) : 0,
    radius: 10,
    speed: 4,
    dx: state.serveToPlayer1 ? 1 : -1,
    dy: (Math.random() < 0.5 ? -1 : 1) * 0.5,
  };

  return {
    state,
    player1,
    player2,
    ball,
    paddle,
  };
})();

const AIGameDefaults = (() => {
  const state = {
    predictedBallY: 0,
    lastPredictionTime: 0,
    ballSpeed: GameDefaults.ball.speed,
    ballDirection: { x: GameDefaults.ball.dx, y: GameDefaults.ball.dy },
    paddleSpeed: GameDefaults.paddle.dy,
    bias: 0.2,
  };

  return {
    state,
  };
})();
