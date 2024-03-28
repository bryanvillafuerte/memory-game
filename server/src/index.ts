import express, { Request, Response } from 'express';
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import fs from 'fs/promises';
const port = process.env.PORT ?? "8888";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

interface LeaderboardEntry {
	playerName: string;
	playerTime: string;
}

let leaderboard: LeaderboardEntry[] = [];

// Validate time format
function isValidTimeFormat(time: string): boolean {
	return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(time);
}

// CRUD Endpoints
// Create endpoint with default playerTime
app.post('/leaderboard', (req: Request, res: Response) => {
	const { playerName, playerTime = "00:00:00" } = req.body; // Default playerTime as "00:00:00"
	if (!isValidTimeFormat(playerTime)) {
		return res.status(400).send('Invalid playerTime format. Use HH:MM:SS.');
	}
	const entry: LeaderboardEntry = { playerName, playerTime };
	leaderboard.push(entry);
	res.status(201).json(entry);
});

// Read (all entries)
app.get('/leaderboard', (req: Request, res: Response) => {
	res.status(200).json(leaderboard);
});

// Update
app.put('/leaderboard/:playerName', (req: Request, res: Response) => {
	const { user } = req.params;
	const { timescore } = req.body;
	if (!isValidTimeFormat(timescore)) {
		return res.status(400).send('Invalid playerTime format. Use HH:MM:SS.');
	}
	const index = leaderboard.findIndex(entry => entry.playerName === user);

	if (index > -1) {
		leaderboard[index].playerTime = timescore;
		res.status(200).json(leaderboard[index]);
	} else {
		res.status(404).send('User not found.');
	}
});

// Delete
app.delete('/leaderboard/:playerName', (req: Request, res: Response) => {
	const { user } = req.params;
	leaderboard = leaderboard.filter(entry => entry.playerName !== user);
	res.status(204).send();
});

// Directory where card background images are stored
const imagesDir = path.join(__dirname, 'images');

// GET Endpoint to list images
app.get('/image-list', async (req, res) => {
	try {
		const files = await fs.readdir(imagesDir);
		const imageUrls = files.map(file => ({
			imageUrl: `http://localhost:${port}/images/${file}`
		}));
		res.json(imageUrls);
	} catch (error) {
		res.status(500).send('Failed to list images');
	}
});

app.use('/images', express.static(imagesDir));

app.listen(port, () => console.log(`Server started on http://localhost:${port}`));
