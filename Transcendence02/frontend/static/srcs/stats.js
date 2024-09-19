async function fetchMatchData() {
  const response = await fetch("https://localhost:8000/api/match-data/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log("data", data);
  return data;
}

function renderChart(data) {
  const ctx = document.getElementById("matchChart").getContext("2d");
  const numMatches = data.length;
  const indices = Array.from({ length: numMatches }, (_, i) => i + 1); // Create indices [1, 2, 3, ...]
  const player1Scores = data.map((match) => match.player1_score);
  const player2Scores = data.map((match) => match.player2_score);

  new Chart(ctx, {
    type: "line",
    data: {
      labels: indices, // Use numerical indices for x-axis labels
      datasets: [
        {
          label: "Player 1 Score",
          data: player1Scores,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          fill: false,
        },
        {
          label: "Player 2 Score",
          data: player2Scores,
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        x: {
          ticks: {
            display: false, // Hide x-axis labels if you don't want any display
          },
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function renderPieChart(data) {
  const ctx = document.getElementById("winChart").getContext("2d");
  const wins = {
    player1Wins: data.filter((match) => match.player1_score > match.player2_score).length,
    player2Wins: data.filter((match) => match.player2_score > match.player1_score).length,
    aiWins: data.filter((match) => match.play_against_ai && match.player2_score > match.player1_score).length,
  };

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Player 1 Wins", "Player 2 Wins", "AI Wins"],
      datasets: [
        {
          label: "Win Distribution",
          data: [wins.player1Wins, wins.player2Wins, wins.aiWins],
          backgroundColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)", "rgba(153, 102, 255, 1)"],
        },
      ],
    },
  });
}

function renderBarChart(data) {
  const ctx = document.getElementById("averageScoreChart").getContext("2d");
  const player1AvgScore = data.reduce((sum, match) => sum + match.player1_score, 0) / data.length;
  const player2AvgScore = data.reduce((sum, match) => sum + match.player2_score, 0) / data.length;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Player 1", "Player 2"],
      datasets: [
        {
          label: "Average Score",
          data: [player1AvgScore, player2AvgScore],
          backgroundColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

async function statsView() {
  const section = `
	  <section>
		<h1>Stats Dashboard</h1>
		<div>
		  <canvas id="matchChart" width="400" height="200"></canvas>
		</div>
		<div>
		  <canvas id="winChart" width="400" height="200"></canvas>
		</div>
		<div>
		  <canvas id="averageScoreChart" width="400" height="200"></canvas>
		</div>
	  </section>
	`;

  async function actions() {
    document.getElementById("dashboard-content").innerHTML = section;

    const data = await fetchMatchData();
    renderChart(data);
    renderPieChart(data);
    renderBarChart(data);
  }
  setTimeout(actions, 0);
  return section;
}
