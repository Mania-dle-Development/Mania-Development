import { pool } from "../config/database.js";

// CLOCK MODE: Same rules as Classic, but the SERVER side times the game
//   startedAt records when the user types their first letter (POST /clock/:id/start)
//   endedAt records the moment the server confirms the winning guess (or the last losing guess).

// POST /api/wordles/clock/:id/start  (called on the first letter typed)
export const startClockGame = (req, res) => {
	const game = req.session.game;
	const problem = checkClockGame(game, req.params.id);
	if (problem) return res.status(400).json({ error: problem });

	// only the FIRST call sets the start time,
	// so refreshing / calling start again can't reset the clock
	if (!game.startedAt) {
		const now = Date.now();
		const clientStart = Number(req.body?.startedAt);

		// use the frontend's start time so the saved time matches the stopwatch.
		// this keeps it between when the wordle was fetched and now
		// (this blocks a fake start time from the future or from before the game existed)
		const start = Number.isFinite(clientStart)
			? Math.min(Math.max(clientStart, game.fetchedAt), now)
			: now;

		game.startedAt = new Date(start);
	}

	res.status(200).json({ startedAt: game.startedAt });
};
