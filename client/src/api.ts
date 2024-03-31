import { parseGridSize, createImagePairs } from "./helpers";
import { renderLeaderboard } from "./leaderboard";

// Function to fetch the leaderboard data from the server
export async function fetchLeaderboard() {
	try {
		const response = await fetch("http://localhost:8888/leaderboard");
		if (!response.ok) {
			throw new Error("Failed to fetch leaderboard");
		}
		const leaderboardData = await response.json();
		renderLeaderboard(leaderboardData); // Render the leaderboard using the retrieved data
	} catch (error) {
		console.error("Error fetching leaderboard:", error);
	}
}

// Function to fetch the list of images from the server
export async function fetchImageList(): Promise<string[]> {
	try {
		const response = await fetch("http://localhost:8888/image-list");
		if (!response.ok) {
			throw new Error("Failed to fetch images");
		}
		const imageObjects: { imageUrl: string }[] = await response.json();
		return imageObjects.map(obj => obj.imageUrl);
	} catch (error) {
		console.error("Error fetching images:", error);
		return []; // Return an empty array if fetching fails
	}
}

// Function to prepare the list of game images based on the grid size
export async function prepareGameImages(gridSize: string): Promise<string[]> {
	const imageList = await fetchImageList();
	const { rows, columns } = parseGridSize(gridSize); // Parse the grid size string into rows and columns
	const neededImages = (rows * columns) / 2; // Calculate the number of image pairs needed for the game

	const selectedImages = imageList.slice(0, neededImages); // Select a subset of images from the image list
	return createImagePairs(selectedImages); // Create pairs of images for the game and return them
}
