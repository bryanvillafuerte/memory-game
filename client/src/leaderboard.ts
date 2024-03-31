export function renderLeaderboard(data: { playerName: string; playerScore: number }[]) {
	const leaderboardContainer = document.querySelector<HTMLDivElement>(".leaderboard"); // Find the leaderboard container in the DOM

	if (!leaderboardContainer) { // Check if the container is not found
		console.error("Leaderboard container not found");
		return;
	}

	// Clear previous content of the leaderboard container
	leaderboardContainer.innerHTML = "<h2>Leaderboard</h2>";

	if (data.length === 0) {
		// If there are no players in the leaderboard, display a message
		const message = document.createElement("p");
		message.textContent = "There are no players in the leaderboard yet.";
		leaderboardContainer.appendChild(message); // Append the message to the leaderboard container
	} else {
		// Sort the data in descending order based on playerScore
		data.sort((a, b) => b.playerScore - a.playerScore);

		// Truncate the data to show only the top 10 players
		const top10Players = data.slice(0, 10);

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

		// Fill table rows with data for the top 10 players
		top10Players.forEach((entry, index) => {
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

		leaderboardContainer.appendChild(table); // Append the table to the leaderboard container
	}
}
