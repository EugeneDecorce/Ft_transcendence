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

function renderMatchTable(data) {
  const tableBody = document.getElementById("matchTableBody");
  console.log("data", data);
  data.forEach((match) => {
    const row = `
		<tr>
		  <td>${match.opponent}</td>
		  <td>${match.play_against_ai ? t("yes") : t("no")}</td>
		  <td>${match.player1_score}</td>
		  <td>${match.player2_score}</td>
		  <td>${new Date(match.created_at).toLocaleString()}</td>
		</tr>
	  `;
    tableBody.innerHTML += row;
  });
}

function renderChart(data) {
  const ctx = document.getElementById("matchChart").getContext("2d");
  const numMatches = data.length;
  const indices = Array.from({ length: numMatches }, (_, i) => i + 1);
  const player1Scores = data.map((match) => match.player1_score);
  const player2Scores = data.map((match) => match.player2_score);

  new Chart(ctx, {
    type: "line",
    data: {
      labels: indices,
      datasets: [
        {
          label: `${t("player")} 1 ${t("score")}`,
          data: player1Scores,
          borderColor: "rgba(0, 0, 255, 1)",
          borderWidth: 1,
          fill: false,
        },
        {
          label: t("yourScore"),
          data: player2Scores,
          borderColor: "rgba(100, 0, 0, 1)",
          borderWidth: 1,
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        x: {
          ticks: {
            display: false,
            fontSize: ts(),
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            fontSize: ts(),
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            fontSize: ts(),
          },
        },
        title: {
          display: true,
          text: t("matchScores"),
          fontSize: ts(),
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
    aiWins: data.filter((match) => match.play_against_ai && match.player1_score > match.player2_score).length,
  };

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: [`${t("player")} 1 ${t("wins")}`, `Your ${t("wins")}`, `${t("ai")} ${t("wins")}`],
      datasets: [
        {
          label: t("winDistribution"),
          data: [wins.player1Wins, wins.player2Wins, wins.aiWins],
          backgroundColor: ["rgba(0, 0, 255, 1)", "rgba(100, 0, 0, 1)", "rgba(0, 100, 0, 1)"],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: {
            fontSize: ts(),
          },
        },
        title: {
          display: true,
          text: t("winDistribution"),
          fontSize: ts(),
        },
      },
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
      labels: [`${t("player")} 1`, t("you")],
      datasets: [
        {
          data: [player1AvgScore, player2AvgScore],
          backgroundColor: ["rgba(0, 0, 255, 1)", "rgba(100, 0, 0, 1)"],
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            fontSize: ts(),
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: t("averageScore"),
          fontSize: ts(),
        },
      },
    },
  });
}

async function statsView() {
  const section = `
	  <section style="padding-top: 20px; padding-bottom: 20px;">
		<h2>${t("statsDashboard")}</h2>
		<div class="chart-container">
		  <canvas id="matchChart"></canvas>
		</div>
		<div class="chart-container">
		  <canvas id="winChart"></canvas>
		</div>
		<div class="chart-container">
		  <canvas id="averageScoreChart"></canvas>
		</div>
		<h3>${t("matchHistory")}</h3>
		<div class="table-responsive">
		  <table class="table table-striped">
			<thead>
			  <tr>
				<th>${t("opponent")}</th>
				<th>${t("againstAI")}</th>
				<th>${t("player1Score")}</th>
				<th>${t("you")}</th>
				<th>${t("date")}</th>
			  </tr>
			</thead>
			<tbody id="matchTableBody">
			  <!-- Match data will be populated here -->
			</tbody>
		  </table>
		</div>
	  </section>
	`;

  async function actions() {
    document.getElementById("dashboard-content").innerHTML = section;

    const data = await fetchMatchData();
    renderChart(data);
    renderPieChart(data);
    renderBarChart(data);
    renderMatchTable(data);
  }
  setTimeout(actions, 0);
  return section;
}
