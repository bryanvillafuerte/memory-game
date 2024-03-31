import "../src/style.css";
import { loadStartGamePage } from "./gameboard";
import { prepareGameImages, fetchLeaderboard } from "./api";

// Set up the initial HTML structure when the DOM is loaded
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
					<div class="leaderboard">
						<h2>Leaderboard</h2>
					</div>
				</div>
			</div>
		</div>
	</div>
`;

// Function to handle form submission
function setupFormHandler() {
	const form = document.querySelector<HTMLFormElement>("form");
	if (!form) {
		console.error("Form not found");
		return;
	}

	form.addEventListener("submit", async event => {
		event.preventDefault();

		// Get player name input and selected grid size
		const playerNameInput = document.querySelector<HTMLInputElement>("#playerName");
		const gridSizeInputs = document.querySelectorAll<HTMLInputElement>("input[name='gridSize']:checked");
		const playerName = playerNameInput ? playerNameInput.value : ""; // Get player name value or set to empty string if not found
		const gridSize = gridSizeInputs.length > 0 ? gridSizeInputs[0].value : ""; // Get selected grid size value

		// Redirect to start game page with player name and grid size as URL parameters
		if (playerName && gridSize) {
			window.location.href = `/start-game?playerName=${encodeURIComponent(playerName)}&gridSize=${encodeURIComponent(gridSize)}`;
		} else {
			console.error("Player name or grid size not specified");
		}
	});
}

// Function to extract URL parameters
function getURLSearchParams() {
	const searchParams = new URLSearchParams(window.location.search);
	return {
		playerName: searchParams.get("playerName") || "", // Get player name parameter or set to empty string if not found
		gridSize: searchParams.get("gridSize") || "", // Get grid size parameter
	};
}

// Event listener for DOMContentLoaded event
document.addEventListener("DOMContentLoaded", async () => {
	const path = window.location.pathname;

	// If on the start-game page
	if (path === "/start-game") {
		const { playerName, gridSize } = getURLSearchParams();
		const shuffledImages = await prepareGameImages(gridSize);
		loadStartGamePage(playerName, gridSize, shuffledImages);
	} else {
		// If on any other page, fetch leaderboard and set up form handler
		fetchLeaderboard();
		setupFormHandler();
	}
});
