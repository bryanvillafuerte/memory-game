import { parseGridSize } from "./helpers";

export function loadStartGamePage(playerName: string, gridSize: string, shuffledImages: string[]) {
	const appContainer = document.querySelector<HTMLDivElement>("#app");
	if (appContainer) {

		appContainer.innerHTML = `
            <div class="start-game-container">
                <div id="overlay" class="overlay">
                    <button id="startButton">Start Game</button>
                </div>
                
                <div id="overlay-game-end" class="overlay-game-end">
                    <div class="overlay-content">
                        <h2>Good job, ${playerName}</h2>
                        <p>Your score is <span class="final-score">0</span></p>
                        <button id="restartGame">Restart Game</button>
                        <button id="submitScore">Submit Score</button>
                    </div>
                </div>
        
                <div class="inner-container">
                    <h1>Memory Game</h1>
                    <h2>Game on, ${playerName}!</h2>
                    
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
			const grid = createGrid(rows, columns, shuffledImages);
			innerContainer.appendChild(grid);
		}
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

	const submitScoreButton = document.getElementById("submitScore");
	submitScoreButton!.addEventListener("click", () => {
		submitScore(playerName);
	});

	const restartGameButton = document.getElementById("restartGame");
	restartGameButton!.addEventListener("click", () => {
		restartGame();
	});
}

function createGrid(rows: number, columns: number, shuffledImages: string[]) {
	const gridContainer = document.createElement("div");
	gridContainer.className = "grid-container";
	gridContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
	gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

	let openedCards: HTMLImageElement[] = [];
	let moveCount = 0;

	for (let i = 0; i < rows * columns; i++) {
		const card = document.createElement("div");
		card.className = "card";
		const img = document.createElement("img");
		img.src = shuffledImages[i];
		img.style.display = "none";
		card.appendChild(img);
		card.addEventListener("click", () => {
			if (img.style.display === "none" && openedCards.length < 2) {
				img.style.display = "block";
				openedCards.push(img);

				if (openedCards.length === 2) {
					const [firstCard, secondCard] = openedCards;
					moveCount++;
					const moveCountElement = document.querySelector(".move-count");
					if (moveCountElement) {
						moveCountElement.textContent = moveCount.toString();
					}

					if (firstCard.src === secondCard.src) {
						openedCards = [];
					} else {
						setTimeout(() => {
							firstCard.style.display = "none";
							secondCard.style.display = "none";
							openedCards = [];
						}, 1000);
					}

					// Check if all cards are opened
					const allCardsOpened = document.querySelectorAll(".card img[style='display: block;']").length === rows * columns;
					if (allCardsOpened) {
						endGame();
					}
				}
			}
		});
		gridContainer.appendChild(card);
	}

	return gridContainer;
}

let timerInterval: NodeJS.Timeout;

function startTimer(display: Element | null) {
	const startTime = Date.now();

	function updateTimer() {
		const elapsedTime = Date.now() - startTime;
		let milliseconds = String(Math.floor((elapsedTime % 1000) / 10));
		let seconds = String(Math.floor((elapsedTime / 1000) % 60));
		let minutes = String(Math.floor((elapsedTime / (1000 * 60)) % 60));

		milliseconds = pad(Number(milliseconds), 2);
		seconds = pad(Number(seconds), 2);
		minutes = pad(Number(minutes), 2);

		display!.textContent = `${minutes}:${seconds}:${milliseconds}`;

		// Calculate score
		const moveCount = parseInt(document.querySelector(".move-count")!.textContent!);
		const score = calculateScore(elapsedTime, moveCount);
		const scoreCountElement = document.querySelector(".score-count");
		if (scoreCountElement) {
			scoreCountElement.textContent = score.toString();
		}
	}

	function pad(num: number, size: number) {
		let s = num.toString();
		while (s.length < size) {
			s = "0" + s;
		}
		return s;
	}

	updateTimer();
	timerInterval = setInterval(updateTimer, 10); // Assign the interval to the global variable
}

function calculateScore(elapsedTime: number, moveCount: number): number {
	// Scoring algorithm: Score is inversely proportional to time and moves
	const maxScore = 10000; // Maximum score
	const maxTime = 600000; // Maximum time (10 minutes) in milliseconds
	const maxMoves = 100; // Maximum moves

	// Calculate score based on time and moves
	const timeScore = maxTime - Math.min(elapsedTime, maxTime);
	const moveScore = maxMoves - Math.min(moveCount, maxMoves);

	// Calculate total score
	return Math.floor((timeScore + moveScore) / (maxTime + maxMoves) * maxScore);
}

function endGame() {
	clearInterval(timerInterval); // Clear the interval to stop the timer
	const overlay = document.getElementById("overlay-game-end");
	if (overlay) {
		overlay.style.display = "flex";

		const finalScoreElement = document.querySelector(".final-score");
		if (finalScoreElement) {
			const score = parseInt(document.querySelector(".score-count")!.textContent!);
			finalScoreElement.textContent = score.toString();
		}
	}
}


function restartGame() {
	window.location.reload();
}

function submitScore(playerName: string) {
	const score = parseInt(document.querySelector(".score-count")!.textContent!);
	const requestBody = {
		playerName: playerName,
		playerScore: score.toString()
	};

	fetch("http://localhost:8888/leaderboard/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(requestBody)
	})
		.then(response => {
			if (!response.ok) {
				throw new Error("Failed to submit score");
			}
			window.location.href = "/";
		})
		.catch(error => {
			console.error("Error submitting score:", error);
			const feedbackElement = document.getElementById("feedback");
			if (feedbackElement) {
				feedbackElement.textContent = "Failed to submit score";
			}
		});
}