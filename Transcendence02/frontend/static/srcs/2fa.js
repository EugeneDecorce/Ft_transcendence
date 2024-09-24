function securityQuestionsView() {
  const section = `
        <section>
            <h2>${t("securityQuestions")}</h2>
            <form id="security-questions-form">
                <div class="form-group">
                    <label for="security-answer-1">${t("whatIsTheNameOfYourFirstPet")}</label>
                    <input type="text" class="form-control" id="security-answer-1" required />
                </div>
                <div class="form-group">
                    <label for="security-answer-2">${t("whatWasTheBrandOfYourFirstCar")}</label>
                    <input type="text" class="form-control" id="security-answer-2" required />
                </div>
                <div class="form-group button-group">
                    <button style="font-size: ${ts()}; background-color: #00008B; border-color: #00008B;" class="btn btn-primary" id="submit-button">${t("submitAnswers")}</button>
                    <button style="font-size: ${ts()}; color: #00008B;" id="login-button2" class="btn btn-link">${t("login")}</button>
                </div>
            </form>
        </section>
    `;

  function actions() {
    // Add event listener for the form submission
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
      if (response.ok) {
        const { accessToken, refreshToken, language, textSize } = data;
        sessionStorage.setItem("language", language);
        sessionStorage.setItem("textSize", textSize);
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);
        document.body.style.fontSize = textSize === "small" ? "12px" : textSize === "large" ? "20px" : "16px";
        navigateTo("/dashboard");
      } else {
        navigateTo("/auth/login");
        alert("Verification failed: Invalid credentials");
      }
    });

    // Event listener for login button
    document.getElementById("login-button2").addEventListener("click", async () => {
      navigateTo("/auth/login");
    });
  }

  setTimeout(() => {
    actions();
  }, 0);

  return section;
}
