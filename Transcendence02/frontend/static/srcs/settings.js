function settingsView() {
  const lang = sessionStorage.getItem("language") || "en";
  const textSize = sessionStorage.getItem("textSize") || "medium";
  console.log("textSize: ", textSize);
  const section = `
	  <section>
		<style>
			.btn-outline-primary:hover {
			background-color: #00008B !important;
			color: white !important;
			}
			.custom-select {
				font-size: ${ts()};
			}
		</style>
		<h${th(2)} class="mr-3">${t("settings")}</h${th(2)}>
		<div id="language-options" class="mb-4">
          <div class="form-group">
            <label for="language-select">${t("language")}</label>
            <select id="language-select" class="form-control">
              <option value="fr" ${lang == "fr" ? "selected" : ""}>Français</option>
              <option value="en" ${lang == "en" ? "selected" : ""}>English</option>
              <option value="es" ${lang == "es" ? "selected" : ""}>Español</option>
            </select>
          </div>
        </div>
		<div id="text-size-options" class="mb-4">
          <div class="form-group">
            <label for="text-size-select">${t("textSize")}</label>
            <select id="text-size-select" class="form-control">
              <option value="small" ${textSize == "small" ? "selected" : ""}>${t("small")}</option>
              <option value="medium" ${textSize == "medium" ? "selected" : ""}>${t("medium")}</option>
              <option value="large" ${textSize == "large" ? "selected" : ""}>${t("large")}</option>
            </select>
          </div>
        </div>
			<h${th(4)} class="mr-3">${t("updateUserInfo")}</h${th(4)}>
		<div id="settings">
		<form id="settings-form" class="needs-validation" novalidate>
			<div id="profile" class="mb-4">
			  <div class="form-group">
				<label for="update-display-name">${t("displayName")}</label>
				<input type="text" class="form-control" id="update-display-name" name="display_name" placeholder="This name will be displayed for tournaments" required>
				<div class="invalid-feedback">${t("pleaseProvideDisplayName")}</div>
			  </div>
			  <div class="form-group">
				<label for="avatar-upload">${t("avatar")}:</label>
				<div>
				<input type="file" class="form-control-file" id="avatar-upload" name="avatar" accept="image/*" style="display: none;" 
						onchange="this.nextElementSibling.nextElementSibling.textContent = this.files.length ? this.files[0].name : ${t("noFileChosen")}">
				<button type="button" class="btn btn-primary" style="font-size: ${ts()}; background-color: #00008B; border-color: #00008B;" onclick="document.getElementById('avatar-upload').click()">${t("chooseFile")}</button>
				<span>${t("noFileChosen")}</span>
				</div>
				<div class="invalid-feedback">${t("pleaseUploadAvatar")}</div>
				<img id="avatar-preview" src="../../public/pong.jpg" alt="Your avatar" class="img-thumbnail mt-2" style="max-width: 150px;">
			  </div>
			</div>
			<button type="submit" class="btn btn-primary" style="font-size: ${ts()}; background-color: #00008B; border-color: #00008B;">${t("save")}</button>
		  </form>
		</div>
		<section class="mt-5">
		  <h${th(2)}>Logout</h${th(2)}>
		  <button id="logout-button" class="btn btn-danger" style="font-size: ${ts()}; background-color: #8B0000; border-color: #8B0000;">${t("logout")}</button>
		</section>
	  </section>
	`;

  async function fetchUserProfile() {
    try {
      const response = await fetch("https://localhost:8000/api/settings/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();
      console.log("data", data);
      document.getElementById("update-display-name").value = data.display_name || "";

      if (data.avatar) {
        const avatarPreview = document.getElementById("avatar-preview");
        avatarPreview.src = `https://localhost:8000${data.avatar}`;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  function actions() {
    document.getElementById("language-select").addEventListener("change", async function () {
      const language = this.value;
      sessionStorage.setItem("language", language);
      const formData = new FormData();
      formData.append("language", language);
      try {
        const response = await fetch("https://localhost:8000/api/update-settings/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to update language");
        }
        alert("Default language successfully updated!");
        location.reload();
      } catch (error) {
        console.error("Error updating language:", error);
        alert("Error updating language");
      }
    });

    document.getElementById("text-size-select").addEventListener("change", async function () {
      const textSize = this.value;
      sessionStorage.setItem("textSize", textSize);
      const formData = new FormData();
      formData.append("textSize", textSize);
      try {
        const response = await fetch("https://localhost:8000/api/update-settings/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to update profile");
        }
        console.log(textSize, "textSize");
        applyTextSize(textSize);
        alert("Default textSize successfully textSize!");
        location.reload();
      } catch (error) {
        console.error("Error updating textSize:", error);
        alert("Error updating textSize");
      }
    });

    document.getElementById("logout-button").addEventListener("click", async () => {
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
      navigateTo("/auth/login");
    });

    document.getElementById("avatar-upload")?.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          console.log(e);
          document.getElementById("avatar-preview").src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    document.getElementById("settings-form").addEventListener("submit", async (event) => {
      event.preventDefault();

      const displayName = document.getElementById("update-display-name").value;
      const avatar = document.getElementById("avatar-upload").files[0];

      const formData = new FormData();
      formData.append("display_name", displayName);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      try {
        const response = await fetch("https://localhost:8000/api/update-settings/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to update profile");
        }
        alert("Profile updated successfully!");
        fetchUserProfile(); // Update the profile display after submission
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Error updating profile");
      }
    });
  }

  setTimeout(actions, 0);
  fetchUserProfile();

  return section;
}

function th(size) {
  const textSize = sessionStorage.getItem("textSize");
  return textSize === "small" ? size + 1 : textSize === "large" ? size - 1 : size;
}

function ts() {
  const textSize = sessionStorage.getItem("textSize");
  return textSize === "small" ? "12px" : textSize === "large" ? "20px" : "16px";
}

function applyTextSize(textSize) {
  // Update body font size
  document.body.style.fontSize = textSize === "small" ? "12px" : textSize === "large" ? "20px" : "16px";
}

document.addEventListener("DOMContentLoaded", () => {
  const savedTextSize = sessionStorage.getItem("textSize");
  if (savedTextSize) {
    applyTextSize(savedTextSize);
    document.getElementById("text-size-select").value = savedTextSize;
  }
});

{
  /* <div id="security-questions" class="mb-4">
			  <h${th(3)}>Security Questions</h${th(3)}>
			  <div class="form-group">
				<label for="update-security-answer-1">Security Answer 1:</label>
				<input type="text" class="form-control" id="update-security-answer-1" name="security_answer_1" required>
				<div class="invalid-feedback">Please provide an answer for security question 1.</div>
			  </div>
			  <div class="form-group">
				<label for="update-security-answer-2">Security Answer 2:</label>
				<input type="text" class="form-control" id="update-security-answer-2" name="security_answer_2" required>
				<div class="invalid-feedback">Please provide an answer for security question 2.</div>
			  </div>
			</div> */
}
