function aiGameModal() {
  return `
	  <div class="modal fade" id="aiModal" tabindex="-1" aria-labelledby="iaModalLabel" aria-hidden="true">
		<div class="modal-dialog">
		  <div class="modal-content">
			<div class="modal-header">
			  <h${th(6)} class="modal-title">${t("ai")} ${t("pongGame")}</h${th(6)}>
			  <button style="font-size: ${ts()};" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
			  <p class="mb-2">${t("ai")}v1 ${"game"}:</p>
			  <ul class="list-group">
				<li class="list-group-item">
				  <strong>${t("ai")} (${t("left")})</strong>: ${t("controlledByTheComputer")}
				</li>
				<li class="list-group-item">
				  <strong>${t("player")} 1 (right)</strong>: ${t("useThe")} <kbd>p</kbd> ${t("and")} <kbd>l</kbd> ${t("keysToMoveUpAndDown")}.
				</li>
			  </ul>
			  <p class="mt-3">${t("youCanAdjustGameOptionsInTheOptionsSection")}.</p>
			  <button type="button" class="btn btn-primary" onclick="aiGameStart()" style="font-size: ${ts()}; background-color: white; border-color: #00008B; color: #00008B;">${t("startGame")}</button>
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
