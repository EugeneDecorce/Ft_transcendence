// Function to handle navigation
function navigateTo(url) {
  history.pushState(null, null, url);
  mainRouter();
}

// Event listener for popstate to handle Back and Forward buttons
window.addEventListener("popstate", () => {
  mainRouter();
});

// Initial call to mainRouter to load the correct content based on the current URL
document.addEventListener("DOMContentLoaded", () => {
  mainRouter();
});

// Function to handle authentication routing
function authRouter() {
  const path = window.location.pathname;
  const container = document.getElementById("container");

  if (path === "/auth/register") {
    container.innerHTML = getRegisterSection();
  } else if (path === "/auth/login") {
    container.innerHTML = getLoginSection();
  } else {
    container.innerHTML = getWelcomeSection();
  }
}

// Function to handle dashboard routing
function dashboardRouter() {
  const path = window.location.pathname;
  const container = document.getElementById("container");

  if (path === "/dashboard") {
    container.innerHTML = getDashboardSection();
  } else {
    container.innerHTML = getNotFoundSection();
  }
}

// Main router function to delegate to the appropriate sub-router
function mainRouter() {
  const path = window.location.pathname;

  if (path.startsWith("/auth")) {
    authRouter();
  } else if (path.startsWith("/dashboard")) {
    dashboardRouter();
  } else {
    const container = document.getElementById("container");
    container.innerHTML = getWelcomeSection();
  }
}
