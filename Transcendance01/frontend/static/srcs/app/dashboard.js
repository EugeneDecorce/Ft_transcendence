function dashboardSectionView() {
  return `
	  <section>
		<nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
		  <div class="container-fluid">
			<a class="navbar-brand" href="#">Dashboard</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
			  <span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarNav">
			  <ul class="navbar-nav ms-auto">
				<li class="nav-item">
				  <a class="nav-link" href="#games" id="games-tab">Games</a>
				</li>
				<li class="nav-item">
				  <a class="nav-link" href="#players" id="players-tab">Players</a>
				</li>
				<li class="nav-item">
				  <a class="nav-link" href="#profile" id="profile-tab">Profile</a>
				</li>
			  </ul>
			</div>
		  </div>
		</nav>
		<div id="dashboard-content" class="container mt-5 pt-5"></div>
	  </section>
	  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
	  <script src="script.js"></script>
	`;
}

function getDashboardSection() {
  const section = dashboardSectionView();
  document.body.innerHTML = section;
  const dashboard_container = document.getElementById("dashboard-content");

  function displayTabSection(sectionView, callback) {
    dashboard_container.innerHTML = sectionView;
    if (callback) callback();
  }

  function updateURLAndDisplay(sectionView, callback, url) {
    history.pushState(null, "", url);
    displayTabSection(sectionView, callback);
  }

  document.getElementById("games-tab").addEventListener("click", (e) => {
    e.preventDefault();
    updateURLAndDisplay(gamesSectionView(), null, "#games");
    Game.setupGame();
  });
  document.getElementById("players-tab").addEventListener("click", (e) => {
    e.preventDefault();
    updateURLAndDisplay(playersSectionView(), null, "#players");
  });
  document.getElementById("profile-tab").addEventListener("click", (e) => {
    e.preventDefault();
    updateURLAndDisplay(profileSectionView(), null, "#profile");
  });
}
