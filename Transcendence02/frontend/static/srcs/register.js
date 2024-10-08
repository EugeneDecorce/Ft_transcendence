function registerView() {
  const section = `
	  <section>
		<h${th(2)}>${t("register")}</h${th(2)}>
		<form id="register-form">
		  <div class="form-group">
			<label for="username">${t("username")}</label>
			<input type="text" class="form-control" id="username" required />
		  </div>
		  <div class="form-group">
			<label for="email">${t("email")}</label>
			<input type="email" class="form-control" id="email" required />
		  </div>
		  <div class="form-group">
			<label for="password">${t("password")}</label>
			<input type="password" class="form-control" id="password" required />
		  </div>
		  <h${th(6)}>${t("securityQuestions")}</h${th(6)}>
		  <div class="form-group">
			<label for="security-answer-1">${t("whatIsTheNameOfYourFirstPet")}</label>
			<input type="text" class="form-control" id="security-answer-1" required />
		  </div>
		  <div class="form-group">
			<label for="security-answer-2">${t("whatWasTheBrandOfYourFirstCar")}</label>
			<input type="text" class="form-control" id="security-answer-2" required />
		  </div>
		  <div class="form-group button-group">
			<button class="btn btn-primary" style="font-size: ${ts()}; background-color: #00008B; border-color: #00008B;">${t("register")}</button>
			<button id="login-button" class="btn btn-link" style="font-size: ${ts()}; color: #00008B;">${t("login")}</button>
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
        alert("Error: Email address badly formatted or username/email already taken");
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
