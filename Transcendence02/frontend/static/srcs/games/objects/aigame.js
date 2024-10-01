const AIGame = (() => {
  let lastPredictionTime = 0;
  let predictedY = 0;
  const maxPaddleSpeed = 5; // Maximum movement speed of the paddle

  // Predict where the Game.ball will be on the Y axis
  function predictY() {
    let ballY = Game.ball.y;
    let ballDy = Game.ball.dy;
    let ballDx = Game.ball.dx;
    let ballSpeed = Game.ball.speed;
    const canvasHeight = Game.state.canvas.height;
    const ballRadius = Game.ball.radius;

    // Time for ball to reach the AI paddle
    const timeToReachPaddle = (Game.player1.x + Game.paddle.width - Game.ball.x) / Math.abs(ballDx);

    // Predict ball's Y position when it reaches the AI paddle
    let predictedY = ballY + ballDy * ballSpeed * timeToReachPaddle;

    // Handle wall bounces
    if (predictedY - ballRadius < 0) {
      predictedY = ballRadius + (ballRadius - predictedY);
    } else if (predictedY + ballRadius > canvasHeight) {
      predictedY = canvasHeight - ballRadius - (predictedY - (canvasHeight - ballRadius));
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

    const paddleCenterY = Game.player1.y + Game.paddle.height / 2;
    const movementThreshold = 10; // Minimum distance to start moving

    if (predictedY < paddleCenterY - movementThreshold) {
      //return Math.max(Game.player1.y - maxPaddleSpeed, predictedY - Game.paddle.height / 2);
      return "w";
    } else if (predictedY > paddleCenterY + movementThreshold) {
      //return Math.min(Game.player1.y + maxPaddleSpeed, predictedY - Game.paddle.height / 2);
      return "s";
    }
    // Stay still if the predicted position is within the movement threshold
    return "";
  }

  return {
    moveAIPaddle,
  };
})();
