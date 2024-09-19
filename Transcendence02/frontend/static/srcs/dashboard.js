async function dashboardView() {
  const section = `
	  <style>
		body, html {
		  margin: 0;
		  padding: 0;
		  width: 100%;
		  height: 100%;
		}
		.navbar {
		  position: fixed;
		  top: 0;
		  left: 0;
		  right: 0;
		  z-index: 1000;
		}
		.container {
		  margin-top: 56px; /* Adjust based on the height of the navbar */
		}
		.navbar-nav .nav-link {
		  margin-right: 1rem; /* Add space between the tabs */
		}
	  </style>
	  <header class="navbar navbar-expand-lg navbar-dark bg-dark">
		<a class="navbar-brand" href="#">Dashboard</a>
		<div class="navbar-nav ml-auto" style="flex-direction: row;">
		  <a class="nav-item nav-link" href="#game" id="dashboard-game">Game</a>
		  <a class="nav-item nav-link" href="#stats" id="dashboard-stats">Stats</a>
		  <a class="nav-item nav-link" href="#players" id="dashboard-players">Players</a>
		  <a class="nav-item nav-link" href="#friends" id="dashboard-friends">Friends</a>
		  <a class="nav-item nav-link" href="#settings" id="dashboard-settings">Settings</a>
		</div>
	  </header>
	  <main class="container" id="dashboard-content">
		<!-- Main content goes here -->
	  </main>
	`;

  function actions() {
    const dashboard_container = document.getElementById("dashboard-content");

    document.getElementById("dashboard-game").addEventListener("click", (e) => {
      e.preventDefault();
      dashboard_container.innerHTML = gameView();
      Game.setupGame();
      Tournament.setupGame();
    });
    document.getElementById("dashboard-players").addEventListener("click", (e) => {
      e.preventDefault();
      dashboard_container.innerHTML = playersView();
    });
    document.getElementById("dashboard-friends").addEventListener("click", (e) => {
      e.preventDefault();
      dashboard_container.innerHTML = friendsView();
    });
    document.getElementById("dashboard-settings").addEventListener("click", (e) => {
      e.preventDefault();
      dashboard_container.innerHTML = settingsView();
    });
    document.getElementById("dashboard-stats").addEventListener("click", (e) => {
      e.preventDefault();
      dashboard_container.innerHTML = statsView();
    });
  }

  setTimeout(actions, 0);
  return section;
}
