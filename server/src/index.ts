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
	playerScore: number;
}

let leaderboard: LeaderboardEntry[] = [];

// CRUD Endpoints
// Create endpoint with default playerScore
app.post('/leaderboard', (req: Request, res: Response) => {
	const { playerName, playerScore = 0 } = req.body;

	const entry: LeaderboardEntry = { playerName, playerScore };
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
	const { score } = req.body;

	const index = leaderboard.findIndex(entry => entry.playerName === user);

	if (index > -1) {
		leaderboard[index].playerScore = score;
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
