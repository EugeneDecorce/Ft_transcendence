function homeView() {
  const section = `
	<section>
	  <h${th(2)}>${t("welcome")}</h${th(2)}>
	  <button id="register-button" class="btn btn-primary" style="background-color: #00008B; color: white; border: none;">${t("register")}</button>
	  <button id="login-button" class="btn btn-secondary" style="background-color: #8B0000; color: white; border: none;">${t("login")}</button>
	  <button id="login42-button" class="btn btn-success" style="background-color: #006400; color: white; border: none;">${t("loginWith42")}</button>
	</section>
  `;

  function actions() {
    document.getElementById("register-button").addEventListener("click", () => {
      navigateTo("/auth/register");
    });

    document.getElementById("login-button").addEventListener("click", () => {
      navigateTo("/auth/login");
    });

    document.getElementById("login42-button").addEventListener("click", () => {
      const clientId = "your_client_id"; // Replace with your actual client ID
      const redirectUri = encodeURIComponent("http://localhost:8000/auth/complete/42/");
      const scope = "public";
      const responseType = "code";
      const state = Math.random().toString(36).substring(2); // Generate a random state value

      // Store the state in session storage or a cookie
      sessionStorage.setItem("oauth_state", state);

      const authorizationUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&state=${state}`;

      window.location.href = authorizationUrl;
    });
  }
  setTimeout(actions, 0);
  return section;
}
