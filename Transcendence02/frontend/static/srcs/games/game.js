function gameView() {
  return `
	  <section class="container mt-5 d-flex flex-column align-items-center">
		<div id="top-bar" class="d-flex justify-content-between mb-3 w-100">
		  <div>
			Tournaments: 
			<button id="launch-btn" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#launchModal">Launch</button>
		  </div>
		  <div>
			Games: 
			<button id="offline-btn" class="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#offlineModal">1v1</button>
			<button id="ia-btn" class="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#aiModal">IA</button>
			<button id="options-btn" class="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#optionsModal">Options</button>
		  </div>
		</div>
		<div id="scoreContainer" class="d-flex justify-content-between mb-3 w-100">
			<!-- Player Score Section Aligned to the Left -->
			<div class="d-flex justify-content-center align-items-center">
				<div id="player1" class="text-center mx-3">Player 1</div>
				<div id="score" class="text-center mx-3">Score</div>
				<div id="player2" class="text-center mx-3">Player 2</div>
			</div>

			<!-- Pause and Quit Buttons Aligned to the Right -->
			<div id="gamePauseStopButtons" class="d-flex ms-3" style="display: none;">
				<button id="pauseButton" class="btn btn-primary" onClick="Game.pauseGame()">Pause</button>
				<button id="quitButton" class="btn btn-danger" onClick="Game.stopGame()">Quit</button>
				<button id="snextGameButton" class="btn btn-primary nowrap-text" onClick="Tournament.startGame()">Next match</button>
			</div>
		</div>
		<div>
			<div id="tournament-next"></div>
		</div>
		<div id="gameContainer" class="position-relative w-100 d-flex justify-content-center">
		  <canvas id="pongCanvas" class="blurred"></canvas>
		  <div id="overlay" class="position-absolute top-50 start-50 translate-middle text-center">
			<h1>Pong Game</h1>
		  </div>
		</div>
	  </section>
	  ${launchTournamentModal()}
	  ${offlineGameModal()}
	  ${aiGameModal()}
	  ${optionsGameModal()}
	`;
}
