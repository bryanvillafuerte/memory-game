export function renderLeaderboard(data: { playerName: string, playerScore: number }[]) {
	const leaderboardContainer = document.querySelector<HTMLDivElement>(".container-column:last-child");

	if (!leaderboardContainer) {
		console.error("Leaderboard container not found");
		return;
	}

	// Clear previous content
	leaderboardContainer.innerHTML = "<h2>Leaderboard</h2>";

	if (data.length === 0) {
		const message = document.createElement("p");
		message.textContent = "There are no players in the leaderboard yet.";
		leaderboardContainer.appendChild(message);
	} else {
		data.sort((a, b) => parseInt(String(b.playerScore)) - parseInt(String(a.playerScore)));

		// Create table and headers
		const table = document.createElement("table");
		const thead = document.createElement("thead");
		const tbody = document.createElement("tbody");
		const headerRow = document.createElement("tr");
		const headerRank = document.createElement("th");
		headerRank.textContent = "Rank";
		const headerPlayer = document.createElement("th");
		headerPlayer.textContent = "Player";
		const headerScore = document.createElement("th");
		headerScore.textContent = "Score";
		headerRow.appendChild(headerRank);
		headerRow.appendChild(headerPlayer);
		headerRow.appendChild(headerScore);
		thead.appendChild(headerRow);
		table.appendChild(thead);
		table.appendChild(tbody);

		// Fill table rows with data
		data.forEach((entry, index) => {
			const row = document.createElement("tr");
			const rankCell = document.createElement("td");
			rankCell.textContent = (index + 1).toString();
			const playerName = document.createElement("td");
			playerName.textContent = entry.playerName;
			const playerScore = document.createElement("td");
			playerScore.textContent = entry.playerScore.toString();
			row.appendChild(rankCell);
			row.appendChild(playerName);
			row.appendChild(playerScore);
			tbody.appendChild(row);
		});

		leaderboardContainer.appendChild(table);
	}
}