import { pool } from "../config/database.js";
import { VALID_GUESSES, scoreGuess } from "../utils/words.js";

// === TODO ===
// combine with wordles.js functions after all modes are complete

export const getRandomSwitcharooWordle = async (req, res) => {
	try {
		// logged in → pick a switcharoo wordle they haven't played yet
		// guest    → any random switcharoo wordle (guests have no saved solves)
		// for switcharoo mode, there is an additional check to ensure
		// there are valid anagrams to switch the word to before fetching
		// some words cannot be played in switcharoo if they have no anagrams
		// CARDINALITY checks the array length of valid anagrams and returns a number
		// it is used over LENGTH b/c LENGTH returns null on empty while CARDINALITY returns 0
		const { rows } = req.user
			? await pool.query(
					`SELECT id, word, valid_anagrams FROM wordles w
                WHERE mode IN ('switcharoo', 'all')
                  AND CARDINALITY(valid_anagrams) > 0
                  AND NOT EXISTS (
                      SELECT 1 FROM solves s
                      WHERE s.wordle_id = w.id
                        AND s.solver_id = $1
                        AND s.mode = 'switcharoo'
                  )
                ORDER BY random()
                LIMIT 1`,
					[req.user.id],
				)
			: await pool.query(
					`SELECT id, word, valid_anagrams FROM wordles
                WHERE mode IN ('switcharoo', 'all') AND CARDINALITY(valid_anagrams) > 0
                ORDER BY random()
                LIMIT 1`,
				);
		const wordle = rows[0];

		// empty result: no switcharoo wordles, or a logged-in user played them all
		if (!wordle) {
			res
				.status(404)
				.json({ error: req.user ? "You've played every switcharoo wordle!" : "No Wordle found" });
			return;
		}

		// immediately fetching anagram so don't have to compute and store later
		const anagram = wordle.valid_anagrams[Math.floor(Math.random() * wordle.valid_anagrams.length)];
		// printing selected anagram in logs for testing
		// === TODO ===
		// remove logs after testing
		console.log("anagram:", anagram);

		// (This is saved under the user's cookie ID)
		req.session.game = {
			wordleId: wordle.id,
			answer: wordle.word.toLowerCase(),
			anagram, // for switcharoo, the anagram is saved in the cookie as well
			startedAt: new Date(),
			guesses: [],
			status: "playing",
		};

		res.json({ id: wordle.id, length: wordle.word.length });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const submitSwitcharooGuess = async (req, res) => {
	try {
		const game = req.session.game;
		const guess = req.body.guess?.toLowerCase();

		// logs for testing
		// === TODO ===
		// remove logs after testing
		console.log(
			"current answer:",
			game.guesses.length > MAX_GUESSES / 2 ? game.anagram : game.answer,
			"guess number: ",
			game.guesses.length,
			"switches on this turn:",
			MAX_GUESSES / 2,
		);

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
		// the word is scored against an anagram after the halfway point in a switcharoo round
		const result = scoreGuess(
			guess,
			game.guesses.length >= MAX_GUESSES / 2 ? game.anagram : game.answer,
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

		// Inserting a logged-in user's attempt in the database, win or lose (guests aren't saved).
		// Switched word is only inserted in a Switcharoo game if the word actually switches during the game
		// if the user guesses the word before the switch occurs, null will be inserted instead
		if (game.status !== "playing" && req.user) {
			await pool.query(
				`INSERT INTO solves (solver_id, wordle_id, mode, started_at, solved_at, num_of_guesses, switched_word)
                VALUES ($1, $2, 'switcharoo', $3, $4, $5, $6)
                ON CONFLICT (solver_id, wordle_id, mode) DO NOTHING`,
				[
					req.user.id,
					game.wordleId,
					game.startedAt,
					won ? new Date() : null,
					game.guesses.length,
					// to adapt it to work in all modes, add an additional check to see if mode === "switcharoo"
					game.guesses.length > MAX_GUESSES / 2 ? game.anagram : null,
				],
			);
		}

		const response = { result, status: game.status };
		if (game.status !== "playing") {
			// the answer for the game changes depending on if the word switches during switcharoo mode
			// to adapt it to work in all modes, add an additional check to see if mode === "switcharoo"
			response.answer = game.guesses.length > MAX_GUESSES / 2 ? game.anagram : game.answer;
		}
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
