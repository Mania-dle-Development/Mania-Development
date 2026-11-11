import { pool } from "../config/database.js";
import { getAnagrams } from "../utils/anagrams.js";
import { VALID_GUESSES, scoreGuess } from "../utils/words.js";

/* ---------- custom wordles (create / browse) ---------- */

const MODES = ["classic", "clock", "switcharoo"];

// check data before it goes into the database
function checkWord(word) {
	if (typeof word !== "string" || !/^[a-zA-Z]{4,8}$/.test(word.trim())) {
		return "Word must be 4 to 8 letters, letters only.";
	}
	return null;
}

function checkMode(mode) {
	if (!MODES.includes(mode)) return "Mode must be classic, clock, or switcharoo.";
	return null;
}

// GET /api/wordles - all custom wordles (hides the answer)
export const getWordles = async (req, res) => {
	try {
		const { rows } = await pool.query(`
			SELECT w.id, LENGTH(w.word) AS letters, w.mode, w.created_at,
			       u.username AS creator, COUNT(s.solver_id)::int AS plays
			FROM wordles w
			JOIN users u ON u.id = w.creator_id
			LEFT JOIN solves s ON s.wordle_id = w.id
			GROUP BY w.id, u.username
			ORDER BY w.created_at DESC
		`);
		res.status(200).json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// GET /api/wordles/mine - wordles the logged-in user made (shows the answer)
export const getMyWordles = async (req, res) => {
	try {
		const { rows } = await pool.query(
			`SELECT w.id, w.word, w.mode, w.created_at, COUNT(s.solver_id)::int AS plays
			 FROM wordles w
			 LEFT JOIN solves s ON s.wordle_id = w.id
			 WHERE w.creator_id = $1
			 GROUP BY w.id
			 ORDER BY w.created_at DESC`,
			[req.user.id],
		);
		res.status(200).json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// GET /api/wordles/:id - one wordle
export const getWordleById = async (req, res) => {
	try {
		const { rows } = await pool.query(
			`SELECT w.id, LENGTH(w.word) AS letters, w.mode, w.created_at, u.username AS creator
			 FROM wordles w
			 LEFT JOIN users u ON u.id = w.creator_id
			 WHERE w.id = $1`,
			[req.params.id],
		);
		if (rows.length === 0) return res.status(404).json({ error: "Wordle not found." });
		res.status(200).json(rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// POST /api/wordles - create a wordle
export const createWordle = async (req, res) => {
	const { word, mode = "classic" } = req.body;
	const error = checkWord(word) || checkMode(mode);
	if (error) return res.status(400).json({ error });

	const clean = word.trim().toLowerCase();
	try {
		const { rows } = await pool.query(
			`INSERT INTO wordles (word, creator_id, mode, valid_anagrams)
			 VALUES ($1, $2, $3, $4)
			 RETURNING id, word, mode, created_at, 0 AS plays`,
			[clean, req.user.id, mode, getAnagrams(clean)],
		);
		res.status(201).json(rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// PATCH /api/wordles/:id - edit some or all of a wordle (only your own)
export const updateWordle = async (req, res) => {
	const { word, mode } = req.body;
	const error = (word !== undefined && checkWord(word)) || (mode !== undefined && checkMode(mode));
	if (error) return res.status(400).json({ error });

	const clean = word !== undefined ? word.trim().toLowerCase() : null;
	try {
		const { rows } = await pool.query(
			`UPDATE wordles
			 SET word = COALESCE($1, word),
			     mode = COALESCE($2::game_mode, mode),
			     valid_anagrams = COALESCE($3, valid_anagrams)
			 WHERE id = $4 AND creator_id = $5
			 RETURNING id, word, mode, created_at`,
			[clean, mode ?? null, clean ? getAnagrams(clean) : null, req.params.id, req.user.id],
		);
		if (rows.length === 0) return res.status(404).json({ error: "Wordle not found or not yours." });
		res.status(200).json(rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// DELETE /api/wordles/:id - delete a wordle (only your own)
export const deleteWordle = async (req, res) => {
	try {
		const { rowCount } = await pool.query(
			"DELETE FROM wordles WHERE id = $1 AND creator_id = $2",
			[req.params.id, req.user.id],
		);
		if (rowCount === 0) return res.status(404).json({ error: "Wordle not found or not yours." });
		res.status(200).json({ message: "Wordle deleted." });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

/* ---------- classic game (playing) ---------- */

const MAX_GUESSES = 6;

export const getRandomClassicWordle = async (req, res) => {
	try {
		// logged in → pick a classic wordle they haven't played yet
		// guest    → any random classic wordle (guests have no saved solves)
		const { rows } = req.user
			? await pool.query(
					`SELECT id, word FROM wordles w
					WHERE mode IN ('classic', 'all')
					  AND NOT EXISTS (
					      SELECT 1 FROM solves s
					      WHERE s.wordle_id = w.id
					        AND s.solver_id = $1
					        AND s.mode = 'classic'
					  )
					ORDER BY random()
					LIMIT 1`,
					[req.user.id],
				)
			: await pool.query(
					`SELECT id, word FROM wordles
					WHERE mode IN ('classic', 'all')
					ORDER BY random()
					LIMIT 1`,
				);
		const wordle = rows[0];

		// empty result: no classic wordles, or a logged-in user played them all
		if (!wordle) {
			res.status(404).json({ error: req.user ? "You've played every classic wordle!" : "No Wordle found" });
			return;
		}

		// (This is saved under the user's cookie ID)
		req.session.game = {
			wordleId: wordle.id,
			answer: wordle.word.toLowerCase(),
			startedAt: new Date(),
			guesses: [],
			status: "playing",
		};

		res.json({ id: wordle.id, length: wordle.word.length });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const submitGuess = async (req, res) => {
	try {
		const game = req.session.game;
		const guess = req.body.guess?.toLowerCase();

		// Validation cases
		if (!game || game.wordleId !== Number(req.params.id)) {
			return res.status(400).json({ error: "No active game for this wordle" });
		}

		if (game.status !== "playing") {
			return res.status(400).json({ error: "Game is already over" });
		}

		if (!guess || guess.length !== game.answer.length) {
			return res.status(400).json({ error: `Guess must be ${game.answer.length} letters` });
		}

		if (!VALID_GUESSES.has(guess)) {
			return res.status(400).json({ error: "Not in word list" });
		}

		// scoring the word and remembering it
		const result = scoreGuess(guess, game.answer);
		game.guesses.push({ word: guess, result });

		// Did the game end?
		const won = result.every((r) => r === "correct");
		const lost = !won && game.guesses.length === MAX_GUESSES;

		// updating the game's status below
		if (won) {
			game.status = "won";
		} else if (lost) {
			game.status = "lost";
		}

		// Inserting a logged-in user's attempt in the database, win or lose (guests aren't saved).
		if (game.status !== "playing" && req.user) {
			await pool.query(
				`INSERT INTO solves (solver_id, wordle_id, mode, started_at, solved_at, num_of_guesses)
				VALUES ($1, $2, 'classic', $3, $4, $5)
				ON CONFLICT (solver_id, wordle_id, mode) DO NOTHING`,
				[req.user.id, game.wordleId, game.startedAt, won ? new Date() : null, game.guesses.length],
			);
		}

		const response = { result, status: game.status };
		if (game.status !== "playing") {
			response.answer = game.answer;
		}
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};