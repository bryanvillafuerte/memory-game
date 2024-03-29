import { parseGridSize } from "./helpers";

// Render the leaderboard on the page
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

// Render the game page
export function loadStartGamePage(playerName: string, gridSize: string, shuffledImages: string[]) {
	const appContainer = document.querySelector<HTMLDivElement>("#app");
	if (appContainer) {

		appContainer.innerHTML = `
			<div class="start-game-container">
				<div id="overlay" class="overlay">
					<button id="startButton"">Start Game</button>
				</div>
			
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

	let openedCards: HTMLImageElement[] = [];

	for (let i = 0; i < rows * columns; i++) {
		const card = document.createElement("div");
		card.className = "card";
		const img = document.createElement("img");
		img.src = shuffledImages[i];
		img.style.display = "none";
		card.appendChild(img);
		card.addEventListener("click", () => {
			// Ensure the card is not already open or matched
			if (img.style.display === "none" && openedCards.length < 2) {
				img.style.display = "block";
				openedCards.push(img); // Add the clicked card to the opened cards array

				// Check if two cards are opened
				if (openedCards.length === 2) {
					const [firstCard, secondCard] = openedCards;
					// Check if the images match
					if (firstCard.src === secondCard.src) {
						// If images match, keep the cards open
						openedCards = [];
					} else {
						// If images do not match, flip back the cards after a short delay
						setTimeout(() => {
							firstCard.style.display = "none";
							secondCard.style.display = "none";
							openedCards = [];
						}, 1000); // Adjust the delay time as needed
					}
				}
			}
		});
		gridContainer.appendChild(card);
	}

	return gridContainer;
}