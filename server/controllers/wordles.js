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

// 404 if the wordle doesn't exist, 403 if it isn't yours
async function checkOwner(id, userId) {
	if (!/^\d+$/.test(id)) return { status: 400, error: "Invalid Wordle id." };
	const { rows } = await pool.query("SELECT creator_id FROM wordles WHERE id = $1", [id]);
	if (rows.length === 0) return { status: 404, error: "Wordle not found." };
	if (rows[0].creator_id !== userId)
		return { status: 403, error: "You can only change your own Wordles." };
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

// GET /api/wordles/me - wordles the logged-in user made (shows the answer)
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

// PATCH /api/wordles/:id - edit a wordle (only your own)
export const updateWordle = async (req, res) => {
	const { word, mode } = req.body;
	if (word == null || mode == null) {
		return res.status(400).json({ error: "Word and mode are both required." });
	}
	const error = checkWord(word) || checkMode(mode);
	if (error) return res.status(400).json({ error });

	try {
		const problem = await checkOwner(req.params.id, req.user.id);
		if (problem) return res.status(problem.status).json({ error: problem.error });

		const clean = word.trim().toLowerCase();
		const { rows } = await pool.query(
			`UPDATE wordles
			 SET word = $1, mode = $2, valid_anagrams = $3
			 WHERE id = $4
			 RETURNING id, word, mode, created_at`,
			[clean, mode, getAnagrams(clean), req.params.id],
		);
		res.status(200).json(rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// DELETE /api/wordles/:id - delete a wordle (only your own)
export const deleteWordle = async (req, res) => {
	try {
		const problem = await checkOwner(req.params.id, req.user.id);
		if (problem) return res.status(problem.status).json({ error: problem.error });

		await pool.query("DELETE FROM wordles WHERE id = $1", [req.params.id]);
		res.status(200).json({ message: "Wordle deleted." });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

/* ---------- game (playing) ---------- */

const MAX_GUESSES = 6;
// the turn right before switcharoo happens; all turns after will compare the guess against the anagram
const SWITCHES_AFTER = Math.ceil(MAX_GUESSES / 2);

// shared check for the session game: returns an error message, or null if the game is OK
const validateGame = (game, id, clock_mode = false) => {
	if (!game || !game.mode || game.wordleId !== Number(id)) return "No active game for this wordle";
	if (clock_mode || game.mode !== "clock") return "No active game for this wordle";
	if (game.status !== "playing") return "Game is already over";
	return null;
};

// POST /api/wordles/clock/:id/start  (called on the first letter typed)
export const startClockGame = (req, res) => {
	const game = req.session.game;
	const problem = validateGame(game, req.params.id, true);
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

// GET /:mode/random -- Fetches a random wordle that can be played in the specified mode
export const getRandomWordle = async (req, res) => {
	try {
		// logged in → pick a switcharoo wordle they haven't played yet
		// guest → any random switcharoo wordle (guests have no saved solves)

		// creator_id IS NULL gives us only default words, never user-created (custom) wordles.

		// for switcharoo mode, there is an additional check to ensure
		// there are valid anagrams to switch the word to before fetching
		// not all words have anagrams which is why they can't be played in switcharoo
		// CARDINALITY checks the array length of valid anagrams and returns a number
		// it is used over LENGTH b/c LENGTH returns null on empty while CARDINALITY returns 0

		if (!req.params.mode) return res.status(400).json({ error: "Mode is required" });

		const mode = req.params.mode;

		if (!MODES.includes(mode))
			return res
				.status(400)
				.json({ error: "Mode must be either 'classic', 'clock', or 'switcharoo'" });

		const { rows } = req.user
			? await pool.query(
					`SELECT id, word, valid_anagrams FROM wordles w
								WHERE mode IN ($2, 'all')
									AND creator_id is NULL
									${mode === "switcharoo" ? "AND CARDINALITY(valid_anagrams) > 0" : ""}
									AND NOT EXISTS (
											SELECT 1 FROM solves s
											WHERE s.wordle_id = w.id
												AND s.solver_id = $1
												AND s.mode = $2
									)
								ORDER BY random()
								LIMIT 1`,
					[req.user.id, mode],
				)
			: await pool.query(
					`SELECT id, word, valid_anagrams FROM wordles
								WHERE mode IN ($1, 'all') 
								${mode === "switcharoo" ? "AND CARDINALITY(valid_anagrams) > 0" : ""} 
								AND creator_id is NULL
								ORDER BY random()
								LIMIT 1`,
					[mode],
				);
		const wordle = rows[0];

		// empty result: no wordles for that mode, or a logged-in user played them all
		if (!wordle) {
			res
				.status(404)
				.json({ error: req.user ? `You've played every ${mode} wordle!` : "No Wordle found" });
			return;
		}

		// immediately fetching anagram so don't have to compute and store later
		const anagram =
			mode === "switcharoo"
				? wordle.valid_anagrams[Math.floor(Math.random() * wordle.valid_anagrams.length)]
				: null;

		// (This is saved under the user's session data)
		req.session.game = {
			wordleId: wordle.id,
			answer: wordle.word.toLowerCase(),
			mode,
			anagram, // for switcharoo, the anagram is saved in the cookie as well; null if not switcharoo
			startedAt: mode === "clock" ? null : new Date(),
			fetchedAt: Date.now(), // the earliest start time we'll accept from the frontend for clock mode
			guesses: [],
			status: "playing",
		};

		res.status(200).json({ id: wordle.id, length: wordle.word.length });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// CLOCK MODE: Same rules as Classic, but the SERVER side times the game
//   startedAt records when the user types their first letter (POST /clock/:id/start)
//   endedAt records the moment the server confirms the winning guess (or the last losing guess).

// SWITCHAROO MODE: Answer switches around the halfway mark into an anagram of the word
// POST /:id/guesses -- Submits and scores a Wordle guess, mode is found in session data
export const submitGuess = async (req, res) => {
	try {
		const game = req.session.game;
		const guess = req.body.guess?.toLowerCase();

		// Validation cases
		const problem = validateGame(game, req.params.id);
		if (problem) return res.status(400).json({ error: problem });

		if (!guess || guess.length !== game.answer.length) {
			return res.status(400).json({ error: `Guess must be ${game.answer.length} letters` });
		}

		if (!VALID_GUESSES.has(guess)) {
			return res.status(400).json({ error: "Not in word list" });
		}

		// backup: if the start request never arrived, start the clock now
		if (game.mode === "clock" && !game.startedAt) game.startedAt = new Date();

		// scoring the word and remembering it
		// the word is scored against an anagram after the halfway point in a switcharoo round
		const result = scoreGuess(
			guess,
			// since the current guess is not added to game.guesses until after this step,
			// we need to add one to the guesses length to get the correct guess number to compare against
			game.mode === "switcharoo" && game.guesses.length + 1 > SWITCHES_AFTER
				? game.anagram
				: game.answer,
		);
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

		const response = { result, status: game.status };

		// Inserting a logged-in user's attempt in the database, win or lose (guests aren't saved).
		// For Switcharoo mode, switched_word is only inserted in a Switcharoo game if the word actually switches during the game
		// if the user guesses the word before the switch occurs, null will be inserted instead
		// for all other modes, it is inserted as null

		if (game.status !== "playing") {
			// for clock mode, stop the clock the moment the server confirms the game is over
			const endedAt = new Date();
			// startedAt may be a string: the session store saves it as JSON
			response.timeMs = endedAt - new Date(game.startedAt);

			if (req.user) {
				await pool.query(
					`INSERT INTO solves (solver_id, wordle_id, mode, started_at, solved_at, num_of_guesses, switched_word)
									VALUES ($1, $2, $7, $3, $4, $5, $6)
									ON CONFLICT (solver_id, wordle_id, mode) DO NOTHING`,
					[
						req.user.id,
						game.wordleId,
						game.startedAt,
						won && game.mode === "clock" ? endedAt : won ? new Date() : null,
						game.guesses.length,
						// === TODO ===
						// to adapt it to work in all modes, add an additional check to see if mode === "switcharoo"
						game.mode === "switcharoo" && game.guesses.length > SWITCHES_AFTER
							? game.anagram
							: null,
						game.mode,
					],
				);
			}
		}

		if (game.status !== "playing") {
			// the answer for the game changes depending on if the word switches during switcharoo mode
			// all other modes keep the same answer
			response.answer =
				game.mode === "switcharoo" && game.guesses.length > SWITCHES_AFTER
					? game.anagram
					: game.answer;
		}
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
