function gameView() {
  return `
	  <section class="container mt-5 d-flex flex-column align-items-center">
		<div id="top-bar" class="d-flex justify-content-between mb-3 w-100">
		  <div>
			${t("tournaments")}: 
			<button id="launch-btn" class="btn btn-primary btn-sm" style="font-size: ${ts()}; background-color: white; border-color: #00008B; color: #00008B;" data-bs-toggle="modal" data-bs-target="#launchModal">${t("launch")}</button>
		  </div>
		  <div>
			${t("game")}: 
			<button id="offline-btn" class="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#offlineModal" style="font-size: ${ts()}; background-color: white; border-color: #00008B; color: #00008B;">1v1</button>
			<button id="ia-btn" class="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#aiModal" style="font-size: ${ts()}; background-color: white; border-color: #00008B; color: #00008B;">${t("ai")}</button>
			<button id="options-btn" class="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#optionsModal" style="font-size: ${ts()}; background-color: white; border-color: #00008B; color: #00008B;">${t("options")}</button>
		  </div>
		</div>
		<div id="scoreContainer" class="d-flex justify-content-between mb-3 w-100">
		  <!-- Player Score Section Aligned to the Left -->
		  <div class="d-flex justify-content-center align-items-center">
			<div id="player1" class="text-center mx-3">${t("player")} 1</div>
			<div id="score" class="text-center mx-3">${t("score")}</div>
			<div id="player2" class="text-center mx-3">${t("player")} 2</div>
		  </div>
  
		  <!-- Pause and Quit Buttons Aligned to the Right -->
		  <div id="gamePauseStopButtons" class="d-flex ms-3" style="display: none;">
			<!-- <button style="font-size: ${ts()};" id="pauseButton" class="btn btn-primary" onClick="Game.pauseGame()">${t("pause")}</button>
			<button style="font-size: ${ts()};" id="quitButton" class="btn btn-danger" onClick="Game.stopGame()">${t("quit")}</button> -->
			<button style="font-size: ${ts()}; background-color: white; border-color: #00008B; color: #00008B;" id="snextGameButton" class="btn btn-primary nowrap-text" onClick="Tournament.startGame()">${t("next match")}</button>
		  </div> 
		</div>
		<div>
		  <div id="tournament-next"></div>
		</div>
		<div id="gameContainer" class="position-relative w-100 d-flex justify-content-center">
		  <canvas id="pongCanvas" class="blurred"></canvas>
		  <div id="overlay" class="position-absolute top-50 start-50 translate-middle text-center">
			<h${th(2)}>${t("pongGame")}</h${th(2)}>
		  </div>
		</div>
	  </section>
	  ${launchTournamentModal()}
	  ${offlineGameModal()}
	  ${aiGameModal()}
	  ${optionsGameModal()}
	`;
}
