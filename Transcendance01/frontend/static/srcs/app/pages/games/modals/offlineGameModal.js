function offlineGameModal() {
  return `
	  <div class="modal fade" id="offlineModal" tabindex="-1" aria-labelledby="offlineModalLabel" aria-hidden="true">
		<div class="modal-dialog">
		  <div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Offline Pong Game</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
				<p class="mb-2">1v1 game:</p>
				<ul class="list-group">
					<li class="list-group-item">
					<strong>Player 1 (left side)</strong>: Use the <kbd>w</kbd> and <kbd>s</kbd> keys to move up and down.
					</li>
					<li class="list-group-item">
					<strong>Player 2 (right side)</strong>: Use the <kbd>p</kbd> and <kbd>l</kbd> keys to move up and down.
					</li>
				</ul>
				<p class="mt-3">You can adjust game options in the Options section.</p>
				<button type="button" class="btn btn-primary" onclick="startGameAndCloseModal()">Start Game</button>
			</div>
		  </div>
		</div>
	  </div>
	`;
}

function startGameAndCloseModal() {
  Game.startGame();
  $("#offlineModal").modal("hide");
}
