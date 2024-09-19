function homeView() {
  const section = `
	  <section>
		<h1>Welcome</h1>
		<button id="register-button" class="btn btn-primary">Register</button>
		<button id="login-button" class="btn btn-secondary">Login</button>
		<button id="login42-button" class="btn btn-success">Login with 42</button>
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
      const clientId = "u-s4t2ud-e2cf60b8472a3659cf6741405c4a073af62109238034430aeaabb111909b9f60";
      const redirectUri = encodeURIComponent("https://localhost:3000/dashboard");
      const scope = "public";
      const responseType = "code";
      const authorizationUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;

      window.location.href = authorizationUrl;
    });
  }
  setTimeout(actions, 0);
  return section;
}
