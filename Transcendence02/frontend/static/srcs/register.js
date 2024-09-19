function registerView() {
  const section = `
	  <section>
		<h1>Register</h1>
		<form id="register-form">
		  <div class="form-group">
			<label for="username">Username</label>
			<input type="text" class="form-control" id="username" required />
		  </div>
		  <div class="form-group">
			<label for="email">Email</label>
			<input type="email" class="form-control" id="email" required />
		  </div>
		  <div class="form-group">
			<label for="password">Password</label>
			<input type="password" class="form-control" id="password" required />
		  </div>
		  <h5>Security questions</h5>
		  <div class="form-group">
			<label for="security-answer-1">What is the name of your first pet ?</label>
			<input type="text" class="form-control" id="security-answer-1" required />
		  </div>
		  <div class="form-group">
			<label for="security-answer-2">What was the brand of your first car ?</label>
			<input type="text" class="form-control" id="security-answer-2" required />
		  </div>
		  <div class="form-group button-group">
			<button type="submit" class="btn btn-primary">Register</button>
			<button type="button" id="login-button" class="btn btn-link">Login</button>
		  </div>
		</form>
	  </section>
	`;

  function actions() {
    document.getElementById("register-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const security_answer_1 = document.getElementById("security-answer-1").value;
      const security_answer_2 = document.getElementById("security-answer-2").value;
      const display_name = username;

      const data = {
        display_name,
        username,
        email,
        password,
        security_answer_1,
        security_answer_2,
      };

      try {
        const response = await fetch("https://localhost:8000/api/register/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        const { accessToken, refreshToken } = result;
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);
        navigateTo("/dashboard");
      } catch (error) {
        console.error("Error during registration:", error);
      }
    });

    document.getElementById("login-button").addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo("/auth/login");
    });
  }

  setTimeout(actions, 0);
  return section;
}
