import "../src/style.css";
import { loadStartGamePage } from "./ui";
import { prepareGameImages, fetchLeaderboard } from "./api";

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
				</div>
			</div>
		</div>
	</div>
`;

// Handle form submission
function setupFormHandler() {
	const form = document.querySelector<HTMLFormElement>("form");
	if (!form) {
		console.error("Form not found");
		return;
	}

	form.addEventListener("submit", async event => {
		event.preventDefault();

		const playerNameInput = document.querySelector<HTMLInputElement>("#playerName");
		const gridSizeInputs = document.querySelectorAll<HTMLInputElement>("input[name='gridSize']:checked");
		const playerName = playerNameInput ? playerNameInput.value : "";
		const gridSize = gridSizeInputs.length > 0 ? gridSizeInputs[0].value : "";

		if (playerName && gridSize) {
			try {
				const response = await fetch("http://localhost:8888/leaderboard", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ playerName }),
				});

				if (!response.ok) {
					throw new Error("Failed to add player to leaderboard")
				}

				window.location.href = `/start-game?playerName=${encodeURIComponent(playerName)}&gridSize=${encodeURIComponent(gridSize)}`;

			} catch (error) {
				console.error("Error adding player to leaderboard:", error);
			}
		} else {
			console.error("Player name or grid size not specified");
		}
	});
}

function getURLSearchParams() {
	const searchParams = new URLSearchParams(window.location.search);
	return {
		playerName: searchParams.get("playerName") || "",
		gridSize: searchParams.get("gridSize") || "",
	};
}

function startTimer(display: Element | null) {
	let startTime = Date.now();

	function updateTimer() {
		let elapsedTime = Date.now() - startTime;
		let milliseconds: string = String(Math.floor((elapsedTime % 1000) / 10));
		let seconds: string = String(Math.floor((elapsedTime / 1000) % 60));
		let minutes: string = String(Math.floor((elapsedTime / (1000 * 60)) % 60));

		milliseconds = pad(Number(milliseconds), 2);
		seconds = pad(Number(seconds), 2);
		minutes = pad(Number(minutes), 2);

		display!.textContent = `${minutes}:${seconds}:${milliseconds}`;
	}

	function pad(num: number, size: number) {
		let s = num.toString();
		while (s.length < size) {
			s = '0' + s;
		}
		return s;
	}

	updateTimer();
	setInterval(updateTimer, 10);
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

	const overlay = document.getElementById("overlay");
	const startButton = document.getElementById("startButton");
	const timeDisplay = document.querySelector(".time");

	// Show overlay when the DOM is loaded
	overlay!.style.display = "flex";

	startButton!.addEventListener("click", () => {
		// Hide the overlay when the button is clicked
		overlay!.style.display = "none";
		startTimer(timeDisplay);
	});
});
