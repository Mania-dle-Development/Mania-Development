import { pool } from "../config/database.js"
import { VALID_GUESSES, scoreGuess } from "../utils/words.js"

const MAX_GUESSES = 6

// CLOCK MODE: Same rules as Classic, but the SERVER side times the game
//   startedAt records when the user types their first letter (POST /clock/:id/start)
//   endedAt records the moment the server confirms the winning guess (or the last losing guess).

// shared check for the session game: returns an error message, or null if the game is OK
const checkClockGame = (game, id) => {
    if (!game || game.mode !== "clock" || game.wordleId !== Number(id)) return "No active game for this wordle"
    if (game.status !== "playing") return "Game is already over"
    return null
}

// GET /api/wordles/clock/random
export const getRandomClockWordle = async (req, res) => {
    try {
        // when a user is...
        // logged in: a clock wordle they haven't played yet
        // guest: any random clock wordle (guests have no saved solves)

        // creator_id IS NULL gives us only default words, never user-created (custom) wordles.
        const { rows } = req.user
            ? await pool.query(
                `SELECT id, word FROM wordles w
                WHERE mode IN ('clock', 'all')
                  AND creator_id IS NULL
                  AND NOT EXISTS (
                      SELECT 1 FROM solves s
                      WHERE s.wordle_id = w.id
                        AND s.solver_id = $1
                        AND s.mode = 'clock'
                  )
                ORDER BY random()
                LIMIT 1`,
                [req.user.id]
            )
            : await pool.query(
                `SELECT id, word FROM wordles
                WHERE mode IN ('clock', 'all')
                  AND creator_id IS NULL
                ORDER BY random()
                LIMIT 1`
            )
        const wordle = rows[0]

        if (!wordle) {
            res.status(404).json({ error: req.user ? "You've played every clock wordle!" : "No Wordle found" })
            return
        }

        // startedAt is null on purpose: the clock doesn't start on page load,
        // only when the user starts typing 
        req.session.game = {
            mode: "clock",
            wordleId: wordle.id,
            answer: wordle.word.toLowerCase(),
            startedAt: null,
            fetchedAt: Date.now(), // the earliest start time we'll accept from the frontend
            guesses: [],
            status: "playing",
        }

        res.status(200).json({ id: wordle.id, length: wordle.word.length })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// POST /api/wordles/clock/:id/start  (called on the first letter typed)
export const startClockGame = (req, res) => {
    const game = req.session.game
    const problem = checkClockGame(game, req.params.id)
    if (problem) return res.status(400).json({ error: problem })

    // only the FIRST call sets the start time,
    // so refreshing / calling start again can't reset the clock
    if (!game.startedAt) {
        const now = Date.now()
        const clientStart = Number(req.body?.startedAt)

        // use the frontend's start time so the saved time matches the stopwatch.
        // this keeps it between when the wordle was fetched and now
        // (this blocks a fake start time from the future or from before the game existed)
        const start = Number.isFinite(clientStart)
            ? Math.min(Math.max(clientStart, game.fetchedAt), now)
            : now

        game.startedAt = new Date(start)
    }

    res.status(200).json({ startedAt: game.startedAt })
}

// POST /api/wordles/clock/:id/guesses
export const submitClockGuess = async (req, res) => {
    try {
        const game = req.session.game
        const guess = req.body.guess?.toLowerCase()

        // Validation cases
        const problem = checkClockGame(game, req.params.id)
        if (problem) return res.status(400).json({ error: problem })

        if (!guess || guess.length !== game.answer.length) {
            return res.status(400).json({ error: `Guess must be ${game.answer.length} letters` })
        }

        if (!VALID_GUESSES.has(guess)) {
            return res.status(400).json({ error: "Not in word list" })
        }

        // backup: if the start request never arrived, start the clock now
        if (!game.startedAt) game.startedAt = new Date()

        // scoring the word and remembering it
        const result = scoreGuess(guess, game.answer)
        game.guesses.push({ word: guess, result })

        // Did the game end?
        const won = result.every((r) => r === "correct")
        const lost = !won && game.guesses.length === MAX_GUESSES

        if (won) {
             game.status = "won"
        }
        else if (lost) {
            game.status = "lost"
        }

        const response = { 
            result, status: game.status
        }

        if (game.status !== "playing") {
            // stop the clock the moment the server confirms the game is over
            const endedAt = new Date()
            // startedAt may be a string: the session store saves it as JSON
            response.timeMs = endedAt - new Date(game.startedAt)
            response.answer = game.answer

            // save logged-in users' attempts, win or lose (guests aren't saved)
            // (solved_at = NULL means the game was lost)
            if (req.user) {
                await pool.query(
                    `INSERT INTO solves (solver_id, wordle_id, mode, started_at, solved_at, num_of_guesses)
                    VALUES ($1, $2, 'clock', $3, $4, $5)
                    ON CONFLICT (solver_id, wordle_id, mode) DO NOTHING`,
                    [req.user.id, game.wordleId, game.startedAt, won ? endedAt : null, game.guesses.length]
                )
            }
        }

        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
