function loginView() {
  const section = `
	  <section>
		<h1>Login</h1>
		<form id="login-form">
		  <div class="form-group">
			<label for="login-username">Username</label>
			<input type="text" class="form-control" id="login-username" required />
		  </div>
		  <div class="form-group">
			<label for="login-password">Password</label>
			<input type="password" class="form-control" id="login-password" required />
		  </div>
		  <div class="form-group button-group">
			<button type="submit" class="btn btn-primary">Next</button>
			<button type="button" id="register-button" class="btn btn-link">Register</button>
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
