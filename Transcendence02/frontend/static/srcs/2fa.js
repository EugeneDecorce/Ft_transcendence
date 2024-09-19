function securityQuestionsView() {
  const section = `
	  <section>
		<h1>Security Questions</h1>
		<form id="security-questions-form">
		  <div class="form-group">
			<label for="security-answer-1">What is the name of your first pet?</label>
			<input type="text" class="form-control" id="security-answer-1" required />
		  </div>
		  <div class="form-group">
			<label for="security-answer-2">What was the brand of your first car?</label>
			<input type="text" class="form-control" id="security-answer-2" required />
		  </div>
		   <div class="form-group button-group">
			<button type="submit" class="btn btn-primary">Submit Answers</button>
			<button type="button" id="login-button2" class="btn btn-link">login</button>
		  </div>
		</form>
	  </section>
	`;

  function actions() {
    document.getElementById("security-questions-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = sessionStorage.getItem("username");
      const security_answer_1 = document.getElementById("security-answer-1").value;
      const security_answer_2 = document.getElementById("security-answer-2").value;

      const response = await fetch("https://localhost:8000/api/2fa/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          security_answer_1,
          security_answer_2,
        }),
      });

      const data = await response.json();
      console.log("data", data);
      if (response.ok) {
        const { accessToken, refreshToken } = data;
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);
        navigateTo("/dashboard");
      } else {
        navigateTo("/auth/login");
        alert("Verification failed: Invalid credentials");
      }
    });

    document.getElementById("login-button2").addEventListener("click", async () => {
      navigateTo("/auth/login");
    });
  }

  setTimeout(actions, 0);
  return section;
}
