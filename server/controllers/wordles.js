import { pool } from "../config/database.js";
import { getAnagrams } from "../utils/anagrams.js";

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