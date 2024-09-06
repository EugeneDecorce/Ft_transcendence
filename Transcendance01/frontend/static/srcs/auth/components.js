document.addEventListener("DOMContentLoaded", () => {
  const togglePassword1 = document.getElementById("toggle-password1");
  if (togglePassword1) {
    togglePassword1.addEventListener("click", function () {
      const passwordField = document.getElementById("register-password");
      const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
      passwordField.setAttribute("type", type);
      const icon = this.querySelector("i");
      icon.classList.toggle("bi-eye");
      icon.classList.toggle("bi-eye-slash");
    });
  }

  const togglePassword2 = document.getElementById("toggle-password2");
  if (togglePassword2) {
    togglePassword2.addEventListener("click", function () {
      const passwordField = document.getElementById("register-password2");
      const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
      passwordField.setAttribute("type", type);
      const icon = this.querySelector("i");
      icon.classList.toggle("bi-eye");
      icon.classList.toggle("bi-eye-slash");
    });
  }
});
