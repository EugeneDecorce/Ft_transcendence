// Function to handle navigation
async function navigateTo(url) {
  history.pushState(null, null, url);
  await mainRouter();
}

async function mainRouter() {
  const path = window.location.pathname;

  if (path === "/auth/register") {
    container.innerHTML = registerView();
  } else if (path === "/auth/login") {
    container.innerHTML = loginView();
  } else if (path === "/auth/2fa") {
    container.innerHTML = securityQuestionsView();
  } else if (path === "/dashboard") {
    container.innerHTML = await dashboardView();
  } else {
    container.innerHTML = homeView();
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
