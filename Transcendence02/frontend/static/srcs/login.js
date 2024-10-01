function loginView() {
  const section = `
	  <section>
		<h${th(2)}>${t("login")}</h${th(2)}>
		<form id="login-form">
		  <div class="form-group">
			<label for="login-username">${t("username")}</label>
			<input type="text" class="form-control" id="login-username" required />
		  </div>
		  <div class="form-group">
			<label for="login-password">${t("password")}</label>
			<input type="password" class="form-control" id="login-password" required />
		  </div>
		  <div class="form-group button-group">
			<button type="submit" class="btn btn-primary" style="background-color: #00008B; border-color: #00008B;">${t("next")}</button>
			<button type="button" id="register-button" class="btn btn-link" style="color: #00008B;">${t("register")}</button>
		  </div>
		</form>
	  </section>
	`;

  function actions() {
    document.getElementById("login-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("login-username").value;
      const password = document.getElementById("login-password").value;

      const response = await fetch("https://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem("username", username);
        navigateTo("/auth/2fa");
      } else {
        alert("Login failed: " + data.detail);
      }
    });

    document.getElementById("register-button").addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo("/auth/register");
    });
  }

  setTimeout(actions, 0);
  return section;
}
