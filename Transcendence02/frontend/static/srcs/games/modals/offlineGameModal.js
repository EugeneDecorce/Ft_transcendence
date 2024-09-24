function offlineGameModal() {
  return `
	  <div class="modal fade" id="offlineModal" tabindex="-1" aria-labelledby="offlineModalLabel" aria-hidden="true">
		<div class="modal-dialog">
		  <div class="modal-content">
			<div class="modal-header">
				<h${th(6)} class="modal-title">1v1 ${t("pongGame")}</h${th(6)}>
				<button style="font-size: ${ts()};" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
				<p class="mb-2">1v1 ${t("game")}:</p>
				<ul class="list-group">
					<li class="list-group-item">
					<strong>${t("otherPlayer")} (${t("left")} side)</strong>: ${t("useThe")} <kbd>w</kbd> ${t("and")} <kbd>s</kbd> ${t("keysToMoveUpAndDown")}.
					</li>
					<li class="list-group-item">
					<strong>${t("you")} (${t("right")} side)</strong>: ${t("useThe")} <kbd>p</kbd> ${t("and")} <kbd>l</kbd> ${t("keysToMoveUpAndDown")}.
					</li>
				</ul>
				<p class="mt-3">${t("youCanAdjustGameOptionsInTheOptionsSection")}.</p>
				<button type="button" class="btn btn-primary" onclick="offlineGameStart()" style="font-size: ${ts()}; background-color: white; border-color: #00008B; color: #00008B;">${t("startGame")}</button>
			</div>
		  </div>
		</div>
	  </div>
	`;
}

function offlineGameStart() {
  Game.startGame();
  const player1Element = document.getElementById("player1");
  const player2Element = document.getElementById("player2");
  player1Element.textContent = "Other player";
  player2Element.textContent = "You";
  $("#offlineModal").modal("hide");
}
