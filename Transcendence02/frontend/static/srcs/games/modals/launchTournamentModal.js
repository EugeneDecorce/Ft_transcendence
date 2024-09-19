// Function to generate the HTML structure for the tournament modal
function launchTournamentModal() {
  const section = `
	  <div class="modal fade" id="launchModal" tabindex="-1" aria-labelledby="launchModalLabel" aria-hidden="true">
		<div class="modal-dialog">
		  <div class="modal-content">
			<div class="modal-header">
			  <h5 class="modal-title" id="launchModalLabel">Launch Tournament</h5>
			  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
			  <div class="mb-3">
				<label for="playerName" class="form-label">Player Display Name</label>
				<input type="text" class="form-control" id="playerName" placeholder="Enter display name">
			  </div>
			  <div class="d-flex justify-content-between">
				<button type="button" class="btn btn-primary" id="addPlayerBtn">Add Player</button>
				<button type="button" class="btn btn-success" id="startTournamentBtn">Start</button>
			  </div>
			  <hr>
			  <h5>Players List</h5>
			  <ul id="playersList" class="list-group" style="max-height: 200px; overflow-y: auto;">
				<!-- List of players will be appended here -->
			  </ul>
			</div>
		  </div>
		</div>
	  </div>
	`;

  // Function to set up the modal and attach event listeners
  function setupTournamentModal() {
    // Ensure the modal is only inserted once
    if (!document.getElementById("launchModal")) {
      document.body.insertAdjacentHTML("beforeend", launchTournamentModal());
    }

    // Grab necessary DOM elements
    const playerNameInput = document.getElementById("playerName");
    const playersListElement = document.getElementById("playersList");
    const addPlayerBtn = document.getElementById("addPlayerBtn");
    const startTournamentBtn = document.getElementById("startTournamentBtn");

    // Set to keep track of added player names
    const playerNamesSet = new Set();

    // Add event listener to the 'Add Player' button
    addPlayerBtn.addEventListener("click", () => {
      const playerName = playerNameInput.value.trim();

      // Ensure the input field is not empty and the name is not a duplicate
      if (playerName && !playerNamesSet.has(playerName)) {
        // Add the player name to the set
        playerNamesSet.add(playerName);

        // Create a new list item and append it to the players list
        const listItem = document.createElement("li");
        listItem.className = "list-group-item d-flex justify-content-between align-items-center";
        listItem.textContent = playerName;

        // Create a remove button and append it to the list item
        const removeButton = document.createElement("button");
        removeButton.className = "btn btn-danger btn-sm";
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => {
          playerNamesSet.delete(playerName);
          playersListElement.removeChild(listItem);
        });

        listItem.appendChild(removeButton);
        playersListElement.appendChild(listItem);

        // Clear the input field after adding the player
        playerNameInput.value = "";
      }
    });

    // Add event listener to the 'Start' button
    startTournamentBtn.addEventListener("click", () => {
      if (playerNamesSet.size >= 3) {
        // Logic to start the tournament
        Tournament.startTournament(new Set(playerNamesSet));
        Tournament.startGame();
        // Clear the player names set
        playerNamesSet.clear();

        // Remove all player list items
        while (playersListElement.firstChild) {
          playersListElement.removeChild(playersListElement.firstChild);
        }
        $("#launchModal").modal("hide");
      } else {
        alert("Please add at least 3 players to start the tournament.");
      }
    });
  }

  setTimeout(setupTournamentModal, 0);
  return section;
}
