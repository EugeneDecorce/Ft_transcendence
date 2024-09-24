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
		  padding-top: 60px; /* Adjust based on the height of the navbar */
		  margin-top: 0px;
		}
		.navbar-nav .nav-link {
		  margin-right: 1rem; /* Add space between the tabs */
		}
	  </style>
	  <header class="navbar navbar-expand-lg navbar-dark bg-dark">
		<a class="navbar-brand" href="#">${t("dashboard")}</a>
		<div class="navbar-nav ml-auto" style="flex-direction: row;">
		  <a class="nav-item nav-link" href="#game" id="dashboard-game">${t("game")}</a>
		  <a class="nav-item nav-link" href="#stats" id="dashboard-stats">${t("stats")}</a>
		  <a class="nav-item nav-link" href="#players" id="dashboard-players">${t("players")}</a>
		  <a class="nav-item nav-link" href="#friends" id="dashboard-friends">${t("friends")}</a>
		  <a class="nav-item nav-link" href="#settings" id="dashboard-settings">${t("settings")}</a>
		  <a class="nav-item nav-link" href="#about" id="dashboard-about">${t("about")}</a>
		</div>
	  </header>
	  <main class="container" id="dashboard-content">
		<!-- Tab content will be dynamically loaded here -->
	  </main>
	`;

  // Inject the HTML structure into the container
  const container = document.getElementById("container");
  container.innerHTML = section;

  // Set up the tab navigation event listeners
  setupDashboardTabListeners();

  // Return the dashboard section HTML to be rendered
  return section;
}
