// Function to handle navigation for main routes
async function navigateTo(url) {
  history.pushState(null, null, url);
  await mainRouter();
}

// Main router function that checks both pathname and hash for dashboard
async function mainRouter() {
  const path = window.location.pathname;
  const hash = window.location.hash;

  if (path === "/auth/register") {
    container.innerHTML = registerView();
  } else if (path === "/auth/login") {
    container.innerHTML = loginView();
  } else if (path === "/auth/2fa") {
    container.innerHTML = securityQuestionsView();
  } else if (path === "/dashboard") {
    // Load the dashboard view and then check for tab navigation (via hash)
    container.innerHTML = await dashboardView();
    handleDashboardTabs(hash); // Handle navigation inside dashboard
  } else {
    container.innerHTML = homeView();
  }
}

// Function to handle tab navigation within the dashboard using hash
function handleDashboardTabs(hash) {
  const dashboardContainer = document.getElementById("dashboard-content");
  if (!hash) {
    dashboardContainer.innerHTML = ""; // Clear the content when no tab is selected
    return;
  }
  // Map hash to views
  const views = {
    "#game": gameView,
    "#players": playersView,
    "#friends": friendsView,
    "#settings": settingsView,
    "#stats": statsView,
    "#about": aboutView,
  };

  // Load the view based on hash or default to the game view
  const viewFunc = views[hash] || gameView;
  dashboardContainer.innerHTML = viewFunc();

  // Setup game if it's the game tab
  if (hash === "#game") {
    Game.setupGame();
    Tournament.setupGame();
  }
}

// Event listener for popstate to handle Back and Forward buttons
window.addEventListener("popstate", async () => {
  await mainRouter();
});

// Initial call to mainRouter to load the correct content based on the current URL
document.addEventListener("DOMContentLoaded", async () => {
  await mainRouter();
});

// Set up event listeners for dashboard tab navigation (if dashboard is loaded)
function setupDashboardTabListeners() {
  document.getElementById("dashboard-game").addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("/dashboard#game");
  });
  document.getElementById("dashboard-players").addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("/dashboard#players");
  });
  document.getElementById("dashboard-friends").addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("/dashboard#friends");
  });
  document.getElementById("dashboard-settings").addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("/dashboard#settings");
  });
  document.getElementById("dashboard-stats").addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("/dashboard#stats");
  });
  document.getElementById("dashboard-about").addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("/dashboard#about");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const modal = document.querySelector("#container");
  const firstFocusableElement = modal.querySelectorAll(focusableElements)[0];
  const focusableContent = modal.querySelectorAll(focusableElements);
  const lastFocusableElement = focusableContent[focusableContent.length - 1];

  document.addEventListener("keydown", (e) => {
    let isTabPressed = e.key === "Tab" || e.keyCode === 9;

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        e.preventDefault();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
      }
    }
  });

  firstFocusableElement.focus();
});
