import { parseGridSize } from "./helpers";

export function renderLeaderboard(data: { playerName: string, playerTime: string }[]) {
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
		// Create table and headers
		const table = document.createElement("table");
		const thead = document.createElement("thead");
		const tbody = document.createElement("tbody");
		const headerRow = document.createElement("tr");
		const headerPlayer = document.createElement("th");
		headerPlayer.textContent = "Player";
		const headerTime = document.createElement("th");
		headerTime.textContent = "Time Score";
		headerRow.appendChild(headerPlayer);
		headerRow.appendChild(headerTime);
		thead.appendChild(headerRow);
		table.appendChild(thead);
		table.appendChild(tbody);

		// Fill table rows with data
		data.forEach(entry => {
			const row = document.createElement("tr");
			const playerName = document.createElement("td");
			playerName.textContent = entry.playerName;
			const playerScore = document.createElement("td");
			playerScore.textContent = entry.playerTime;
			row.appendChild(playerName);
			row.appendChild(playerScore);
			tbody.appendChild(row);
		});

		leaderboardContainer.appendChild(table);
	}
}

export function loadStartGamePage(playerName: string, gridSize: string, shuffledImages: string[]) {
	const appContainer = document.querySelector<HTMLDivElement>("#app");
	if (appContainer) {

		appContainer.innerHTML = `
			<div class="start-game-container">
				<div class="inner-container">
					<h1>Memory Game</h1>
					<h3>Game on, ${playerName}! The timer will start once you click on a card.</h3>
					
					<div class="score-container">
						<div class="timer">
							<div>Timer</div>
							<div class="time">00:00:00</div>
						</div>
						<div class="moves">
							<div>Moves</div>
							<div class="move-count">0</div>
						</div>
						<div class="score">
							<div>Score</div>
							<div class="score-count">0</div>
						</div>
					</div>
					
					<div class="game-container"></div>
					
					<a href="/">Back to main page</a>
				</div>
			</div>
		`;

		const innerContainer = appContainer.querySelector(".game-container");
		if (innerContainer) {
			const { rows, columns } = parseGridSize(gridSize);
			const grid = createGrid(rows, columns, shuffledImages); // Now passing shuffledImages
			innerContainer.appendChild(grid);
		}
	}
}

function createGrid(rows: number, columns: number, shuffledImages: string[]) {
	const gridContainer = document.createElement("div");
	gridContainer.className = "grid-container";
	gridContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
	gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

	for (let i = 0; i < rows * columns; i++) {
		const card = document.createElement("div");
		card.className = "card";
		const img = document.createElement("img");
		img.src = shuffledImages[i]; // Assign an image to each card
		img.style.display = "none"; // Initially hide the image
		card.appendChild(img);
		card.addEventListener("click", () => {
			img.style.display = "block"; // Show the image when the card is clicked
			// Add logic here for checking matches
		});
		gridContainer.appendChild(card);
	}

	return gridContainer;
}