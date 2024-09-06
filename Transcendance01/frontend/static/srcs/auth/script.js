// LOGIN WITH 42
function login42FormEventListener() {
  alert("Login with 42 functionality will be implemented later.");
}

// LOGIN
function loginFormEventListener() {
  const content = document.getElementById("login");
  content.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    fetch("http://localhost:8000/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.detail || "Login failed");
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.access) {
          localStorage.setItem("access_token", data.access);
          localStorage.setItem("refresh_token", data.refresh);
          navigateTo("/dashboard");
        } else {
          alert("Login failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
        alert(error.message);
      });
  });
}

// REGISTER
function registerFormEventListener() {
  const content = document.getElementById("register");
  content.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const password2 = document.getElementById("register-password2").value;
    const email = document.getElementById("register-email").value;

    fetch("http://localhost:8000/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, password2, email }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.detail || (password !== password2 ? "Passwords do not match" : "Username or email are already taken."));
          });
        }
        return response.json();
      })
      .then((data) => {
        alert("Registration successful! " + data.message);
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        document.getElementById("register").reset();
        navigateTo("/dashboard");
      })
      .catch((error) => {
        console.error("Error:", error.message);
        alert(error.message);
      });
  });
}

// LOGOUT
function logoutEventListener() {
  const content = document.getElementById("logout");
  content.addEventListener("click", () => {
    // Clear the token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    window.location.href = "/auth/login";
  });
}
