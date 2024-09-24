async function playersView() {
  try {
    // Fetch user data from the API
    const response = await fetch("https://localhost:8000/api/players/");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const users = await response.json();

    // Fetch friends data from the API
    const friendsResponse = await fetch("https://localhost:8000/api/friends/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });
    if (!friendsResponse.ok) {
      throw new Error("Network response was not ok");
    }
    const friends = await friendsResponse.json();
    const friendUsernames = friends.map((friend) => friend.username);

    const current_user = sessionStorage.getItem("username");

    // Filter out friends from the list of users
    const nonFriendUsers = users.filter((user) => !friendUsernames.includes(user.username));

    // Create and insert the HTML structure with Bootstrap styling
    const section = `
		<section id="players-section" class="container mt-4">
		  <h${th(2)} class="mb-4">${t("players")}</h${th(2)}>
		  <div id="players" class="list-group">
			${nonFriendUsers
        .map(
          (user, index) => `
				<div class="list-group-item d-flex justify-content-between align-items-center" data-user-id="${user.id}">
				<span class="player-index" style="margin-right: 15px;">#${index + 1}:</span>
				<img id="avatar-preview" src="${user.avatar ? user.avatar : "../../public/pong.jpg"}" alt="Player avatar" class="mt-2" style="max-width: 50px; margin-right: 15px;">
				<span class="player-username" style="margin-right: 15px;">${user.username}</span>
				<span class="player-status badge" style="background-color: ${user.is_active ? "#006400" : "#640000"}; color: white; margin-right: 15px;">
					${user.is_active ? t("online") : t("Offline")}
				</span>
				<button class="font-size: ${ts()}; btn btn-primary btn-sm add-friend" data-user-id="${user.id}" ${user.username === current_user ? "disabled" : ""} style="background-color: white; border-color: #00008B; color: #00008B; margin-left: 15px;">
					${t("addFriend")}
				</button>
			</div>
			  `
        )
        .join("")}
		  </div>
		</section>
	  `;

    // Insert the HTML into the #dashboard-content container
    document.getElementById("dashboard-content").innerHTML = section;

    // Add event listeners to the 'Add Friend' buttons
    document.querySelectorAll(".add-friend").forEach((button) => {
      button.addEventListener("click", function () {
        const userId = this.getAttribute("data-user-id");
        console.log(`Add friend with ID: ${userId}`);

        fetch("https://localhost:8000/api/add-friend/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ friend_id: userId }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            console.log("Friend added:", data);
            // Remove the friend's row from the DOM
            const friendRow = document.querySelector(`.list-group-item[data-user-id="${userId}"]`);
            if (friendRow) {
              friendRow.remove();
            }
          })
          .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
          });
      });
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}
