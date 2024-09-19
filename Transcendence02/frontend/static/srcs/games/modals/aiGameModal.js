function aiGameModal() {
  return `
	  <div class="modal fade" id="aiModal" tabindex="-1" aria-labelledby="iaModalLabel" aria-hidden="true">
		<div class="modal-dialog">
		  <div class="modal-content">
			<div class="modal-header">
			  <h5 class="modal-title">IA Pong Game</h5>
			  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
			  <p class="mb-2">AIv1 game:</p>
			  <ul class="list-group">
				<li class="list-group-item">
				  <strong>AI (left side)</strong>: Controlled by the computer.
				</li>
				<li class="list-group-item">
				  <strong>Player 1 (right side)</strong>: Use the <kbd>p</kbd> and <kbd>l</kbd> keys to move up and down.
				</li>
			  </ul>
			  <p class="mt-3">You can adjust game options in the Options section.</p>
			  <button type="button" class="btn btn-primary" onclick="aiGameStart()">Start Game</button>
			</div>
		  </div>
		</div>
	  </div>
	`;
}

function aiGameStart() {
  Game.startGame();
  Game.state.playAgainstAI = true;
  $("#aiModal").modal("hide");
}
