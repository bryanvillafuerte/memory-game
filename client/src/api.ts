import { parseGridSize, createImagePairs } from "./helpers";
import { renderLeaderboard } from "./ui";

export async function fetchLeaderboard() {
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
		return [];
	}
}

export async function prepareGameImages(gridSize: string): Promise<string[]> {
	const imageList = await fetchImageList();
	const { rows, columns } = parseGridSize(gridSize);
	const neededImages = (rows * columns) / 2;

	const selectedImages = imageList.slice(0, neededImages);
	return createImagePairs(selectedImages);
}