function gamesSectionView() {
  return `
	      <section>
      <div id="top-bar" class="d-flex justify-content-between mb-3">
        <div>
          Tournaments: 
          <button id="join-btn" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#joinModal">Join</button>
          <button id="launch-btn" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#launchModal">Launch</button>
        </div>
        <div>
          Games: 
          <button id="offline-btn" class="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#offlineModal">Offline</button>
          <button id="online-btn" class="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#onlineModal">Online</button>
          <button id="ia-btn" class="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#iaModal">IA</button>
          <button id="options-btn" class="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#optionsModal">Options</button>
        </div>
      </div>
      <div id="score" class="text-center mb-3">Score</div>
      <div id="gameContainer" class="position-relative">
        <canvas id="pongCanvas" class="blurred"></canvas>
        <div id="overlay" class="position-absolute top-50 start-50 translate-middle text-center">
          <h1>Pong Game</h1>
        </div>
      </div>
    </section>
    ${joinTournamentModal()}
    ${launchTournamentModal()}
    ${offlineGameModal()}
    ${onlineGameModal()}
    ${iaGameModal()}
    ${optionsGameModal()}
	`;
}
