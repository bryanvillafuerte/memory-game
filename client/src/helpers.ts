// Function to parse the grid size string into columns and rows
export function parseGridSize(gridSize: string) {
	const [columns, rows] = gridSize.split("x").map(Number); // Split the string at 'x' and convert each part to a number
	return { columns, rows }; // Return an object containing columns and rows
}

// Function to create pairs of images from the image list and shuffle them
export function createImagePairs(imageList: string[]) {
	const pairs = imageList.concat(imageList); // Duplicate the image list to create pairs
	return shuffleArray(pairs); // Shuffle the pairs array
}

// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array: any[]) {
	for (let i = array.length - 1; i > 0; i--) { // Iterate through the array in reverse order
		const j = Math.floor(Math.random() * (i + 1)); // Generate a random index from 0 to i
		[array[i], array[j]] = [array[j], array[i]]; // Swap the elements at indices i and j
	}
	return array; // Return the shuffled array
}
