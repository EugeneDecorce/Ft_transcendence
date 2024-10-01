async function friendsView() {
  try {
    // Fetch friends data from the API
    const response = await fetch("https://localhost:8000/api/friends/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });
    console.log("response", response);
    const friends = await response.json();
    console.log("friends", friends);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const current_user = sessionStorage.getItem("username");
    console.log("friends", friends, current_user);

    // Create and insert the HTML structure with Bootstrap styling
    const section = `
		<section id="friends-section" class="container mt-4">
		  <h${th(2)} class="mb-4">${t("friends")}</h${th(2)}>
		  <div id="friends" class="list-group">
			${friends
        .map(
          (friend, index) => `
				  <div class="list-group-item d-flex justify-content-between align-items-center">
					<span class="friend-index" style="margin-right: 15px;">#${index + 1}:</span>
					<img id="avatar-preview" src="${friend.avatar ? friend.avatar : "../../public/pong.jpg"}" alt="User avatar" class="mt-2" style="max-width: 50px; margin-right: 15px;">
					<span class="friend-username" style="margin-right: 15px;">${friend.username}</span>
					<span class="friend-status badge bg-${friend.is_active ? "success" : "secondary"}" style="background-color: ${friend.is_active ? "#006400" : "#640000"}; color: white; margin-right: 15px;">
						${friend.is_active ? "Online" : "Offline"}
					</span>
					<button class="btn btn-danger btn-sm remove-friend-btn" data-friend-id="${friend.id}" style="background-color: white; border-color: ##640000; color: ##640000; margin-left: 15px;">
						${t("removeFriend")}
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

    // Attach event listeners to the "Remove Friend" buttons
    document.querySelectorAll(".remove-friend-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const friendId = event.target.getAttribute("data-friend-id");
        await removeFriend(friendId);
      });
    });
  } catch (error) {
    console.error("Error fetching friends data:", error);
  }
}

async function removeFriend(friendId) {
  try {
    const response = await fetch(`https://localhost:8000/api/friends/${friendId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    console.log(`Friend with ID ${friendId} removed successfully.`);
    // Refresh the friends list
    friendsView();
  } catch (error) {
    console.error("Error removing friend:", error);
  }
}
