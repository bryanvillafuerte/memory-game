import "../src/style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
	<div class="main-container">
		<div class="inner-container">
			<div class="heading">
				<h1>Memory game</h1>
			</div>
			
			<div class="content">
				<div class="container-column">
					<form>
						<div class="player-input">
							<label for="playerName">Player name</label>
							<input type="text" id="playerName" name="playerName" required>
						</div>
						
						<h2>Number of Grids:</h2>
						<div class="radio-tabs">
							<div class="tab">
								<input type="radio" id="grid6x6" name="gridSize" value="6x6" checked>
								<label for="grid6x6">6x6</label>
							</div>
			
							<div class="tab">
								<input type="radio" id="grid8x6" name="gridSize" value="8x6">
								<label for="grid8x6">8x6</label>
							</div>
			
							<div class="tab">
								<input type="radio" id="grid10x6" name="gridSize" value="10x6">
								<label for="grid10x6">10x6</label>
							</div>
						</div>
						
						<button type="submit">Start Game</button>
					</form>
				</div>
				
				<div class="container-column">
					<h2>Leaderboard</h2>
					<!-- put in here the list of users -->
				</div>
			</div>
		</div>
	</div>
`;

// Fetch leaderboard data from the server
async function fetchLeaderboard() {
	try {
		const response = await fetch("http://localhost:8888/leaderboard");
		if (!response.ok) {
			throw new Error("Failed to fetch leaderboard");
		}
		const leaderboardData = await response.json();
		renderLeaderboard(leaderboardData);
	} catch (error) {
		console.error("Error fetching leaderboard:", error);
	}
}

// Render leaderboard data
function renderLeaderboard(data: { playerName: string, playerTime: string }[]) {
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

// Handle form submission
function setupFormHandler() {
	const form = document.querySelector<HTMLFormElement>("form");
	if (!form) {
		console.error("Form not found");
		return;
	}

	form.addEventListener("submit", event => {
		event.preventDefault();

		const playerNameInput = document.querySelector<HTMLInputElement>("#playerName");
		const gridSizeInputs = document.querySelectorAll<HTMLInputElement>("input[name='gridSize']:checked");
		const playerName = playerNameInput ? playerNameInput.value : "";
		const gridSize = gridSizeInputs.length > 0 ? gridSizeInputs[0].value : "";

		if (playerName && gridSize) {
			window.location.href = `/start-game?playerName=${encodeURIComponent(playerName)}&gridSize=${encodeURIComponent(gridSize)}`;
		} else {
			console.error("Player name or grid size not specified");
		}
	});
}

// Render the card grid and start the game
function loadStartGamePage(playerName: string, gridSize: string, shuffledImages: string[]) {
	const appContainer = document.querySelector<HTMLDivElement>("#app");
	if (appContainer) {

		appContainer.innerHTML = `
			<div class="start-game-container">
				<div class="inner-container">
					<h1>Memory Game</h1>
					<h3>Player: ${playerName}</h3>
					
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


function getURLSearchParams() {
	const searchParams = new URLSearchParams(window.location.search);
	return {
		playerName: searchParams.get("playerName") || "",
		gridSize: searchParams.get("gridSize") || "",
	};
}

function parseGridSize(gridSize: string) {
	const [columns, rows] = gridSize.split("x").map(Number);
	return { columns, rows };
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


// Fetch images from the server to be used as card backgrounds
async function fetchImageList(): Promise<string[]> {
	try {
		const response = await fetch("http://localhost:8888/image-list");
		if (!response.ok) {
			throw new Error("Failed to fetch images");
		}
		const imageObjects: { imageUrl: string }[] = await response.json();
		return imageObjects.map(obj => obj.imageUrl);
	} catch (error) {
		console.error("Error fetching images:", error);
		return [];
	}
}

function createImagePairs(imageList: string[]) {
	const pairs = imageList.concat(imageList); // Duplicate the array to create pairs
	console.log(pairs);
	return shuffleArray(pairs); // Shuffle the array to randomize the pairs
}

function shuffleArray(array: any[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]]; // Swap elements
	}
	return array;
}

// This function now also takes gridSize to ensure the correct number of images is used
async function prepareGameImages(gridSize: string): Promise<string[]> {
	const imageList = await fetchImageList();
	const { rows, columns } = parseGridSize(gridSize);
	const neededImages = (rows * columns) / 2;

	const selectedImages = imageList.slice(0, neededImages);
	return createImagePairs(selectedImages);
}

document.addEventListener("DOMContentLoaded", async () => {
	const path = window.location.pathname;

	if (path === "/start-game") {
		const { playerName, gridSize } = getURLSearchParams();
		const shuffledImages = await prepareGameImages(gridSize);
		loadStartGamePage(playerName, gridSize, shuffledImages);
	} else {
		fetchLeaderboard();
		setupFormHandler();
	}
});
