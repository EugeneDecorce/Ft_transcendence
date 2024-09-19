function settingsView() {
  const section = `
	  <section>
		<h1>Settings</h1>
		<div id="settings">
		  <form id="settings-form" class="needs-validation" novalidate>
			<div id="profile" class="mb-4">
			  <h2>Profile</h2>
			  <div class="form-group">
				<label for="update-display-name">Display Name:</label>
				<input type="text" class="form-control" id="update-display-name" name="display_name" placeholder="This name will be displayed for tournaments" required>
				<div class="invalid-feedback">Please provide a display name.</div>
			  </div>
			  <div class="form-group">
				<label for="avatar-upload">Avatar:</label>
				<input type="file" class="form-control-file" id="avatar-upload" name="avatar" accept="image/*">
				<div class="invalid-feedback">Please upload an avatar.</div>
				<img id="avatar-preview" src="../../public/pong.jpg" alt="Avatar" class="img-thumbnail mt-2" style="max-width: 150px;">
			  </div>
			</div>
			<button type="submit" class="btn btn-primary">Save</button>
		  </form>
		</div>
		<section class="mt-5">
		  <h1>Logout</h1>
		  <button id="logout-button" class="btn btn-danger">Logout</button>
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

{
  /* <div id="security-questions" class="mb-4">
			  <h2>Security Questions</h2>
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
