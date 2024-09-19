function optionsGameModal() {
  return `
	  <div class="modal fade" id="optionsModal" tabindex="-1" aria-labelledby="optionsModalLabel" aria-hidden="true">
		<div class="modal-dialog">
		  <div class="modal-content">
			<div class="modal-header">
			  <h5 class="modal-title" id="optionsModalLabel">Game Options</h5>
			  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
			  <form id="gameOptionsForm">
				<!-- Points to Win -->
				<div class="mb-3">
				  <label for="pointsToWin" class="form-label">Points to Win</label>
				  <input type="number" class="form-control" id="pointsToWin" value="5" min="1" max="20">
				</div>
				
				<!-- Ball Speed -->
				<div class="mb-3">
				  <label for="ballSpeed" class="form-label">Ball Speed</label>
				  <input type="range" class="form-range" id="ballSpeed" min="1" max="10" value="4">
				  <div class="d-flex justify-content-between">
					<small>Slow</small><small>Fast</small>
				  </div>
				</div>
  
				<!-- Ball Radius -->
				<div class="mb-3">
				  <label for="ballRadius" class="form-label">Ball Radius</label>
				  <input type="range" class="form-range" id="ballRadius" min="5" max="30" value="10">
				  <div class="d-flex justify-content-between">
					<small>Small</small><small>Large</small>
				  </div>
				</div>
  
				<!-- Paddle Width -->
				<div class="mb-3">
				  <label for="paddleWidth" class="form-label">Paddle Width</label>
				  <input type="range" class="form-range" id="paddleWidth" min="5" max="50" value="10">
				  <div class="d-flex justify-content-between">
					<small>Narrow</small><small>Wide</small>
				  </div>
				</div>
  
				<!-- Paddle Height -->
				<div class="mb-3">
				  <label for="paddleHeight" class="form-label">Paddle Height</label>
				  <input type="range" class="form-range" id="paddleHeight" min="50" max="200" value="100">
				  <div class="d-flex justify-content-between">
					<small>Short</small><small>Tall</small>
				  </div>
				</div>
  

				<!-- Buttons -->
				<div class="d-flex justify-content-between">
				  <button type="button" class="btn btn-secondary" onclick="resetGameOptions()">Revert to Defaults</button>
				  <button type="button" class="btn btn-primary" onclick="saveGameOptions()">Save Options</button>
				</div>
			  </form>
			</div>
		  </div>
		</div>
	  </div>
	`;
}

// <!-- AI Difficulty -->
// 				<div class="mb-3">
// 				  <label for="aiDifficulty" class="form-label">AI Difficulty</label>
// 				  <select class="form-select" id="aiDifficulty">
// 					<option value="easy">Easy</option>
// 					<option value="medium" selected>Medium</option>
// 					<option value="hard">Hard</option>
// 					<option value="impossible">Impossible</option>
// 				  </select>
// 				</div>
function resetGameOptions() {
  // Revert all input fields to default values
  document.getElementById("pointsToWin").value = 5;
  document.getElementById("ballSpeed").value = 4;
  document.getElementById("ballRadius").value = 10;
  document.getElementById("paddleWidth").value = 10;
  document.getElementById("paddleHeight").value = 100;
  document.getElementById("aiDifficulty").value = "medium";

  Game.state.pointsToWin = GameDefaults.state.pointsToWin;
  Game.ball.speed = GameDefaults.ball.speed;
  Game.ball.radius = GameDefaults.ball.radius;
  Game.paddle.width = GameDefaults.paddle.width;
  Game.paddle.height = GameDefaults.paddle.height;
  AIGame.state.bias = AIGameDefaults.state.bias;

  Tournament.state.pointsToWin = GameDefaults.state.pointsToWin;
  Tournament.ball.speed = GameDefaults.ball.speed;
  Tournament.ball.radius = GameDefaults.ball.radius;
  Tournament.paddle.width = GameDefaults.paddle.width;
  Tournament.paddle.height = GameDefaults.paddle.height;

  // Hide the modal after saving
  const optionsModal = bootstrap.Modal.getInstance(document.getElementById("optionsModal"));
  optionsModal.hide();
}

function saveGameOptions() {
  const aiDifficulty = document.getElementById("aiDifficulty").value;

  // Update the game state with new values
  Game.state.pointsToWin = parseInt(document.getElementById("pointsToWin").value);
  Game.ball.speed = parseInt(document.getElementById("ballSpeed").value);
  Game.ball.radius = parseInt(document.getElementById("ballRadius").value);
  Game.paddle.width = parseInt(document.getElementById("paddleWidth").value);
  Game.paddle.height = parseInt(document.getElementById("paddleHeight").value);
  Tournament.state.pointsToWin = parseInt(document.getElementById("pointsToWin").value);
  Tournament.ball.speed = parseInt(document.getElementById("ballSpeed").value);
  Tournament.ball.radius = parseInt(document.getElementById("ballRadius").value);
  Tournament.paddle.width = parseInt(document.getElementById("paddleWidth").value);
  Tournament.paddle.height = parseInt(document.getElementById("paddleHeight").value);

  // Update AI difficulty (you can adjust how the AI difficulty impacts the game)
  switch (aiDifficulty) {
    case "easy":
      AIGame.state.bias = 1;
      break;
    case "medium":
      AIGame.state.bias = 0.5;
      break;
    case "hard":
      AIGame.state.bias = 0.2;
      break;
    case "impossible":
      AIGame.state.bias = 0;
      break;
  }

  // Hide the modal after saving
  const optionsModal = bootstrap.Modal.getInstance(document.getElementById("optionsModal"));
  optionsModal.hide();
}
