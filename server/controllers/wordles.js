import { pool } from "../config/database.js"
import { VALID_GUESSES, scoreGuess } from '../utils/words.js'

const MAX_GUESSES = 6

export const getRandomWordle = async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT id, word FROM wordles
            WHERE mode IN ('classic', 'all')
            ORDER BY random()
            LIMIT 1
            `,
        )
        const wordle = rows[0]

        if(!wordle) {
            res.status(404).json( { error: "No Wordle found" })
            return
        }

        // (This is saved under the user's cookie ID)
        req.session.game = {
            wordleId: wordle.id,
            answer: wordle.word.toLowerCase(),
            startedAt: new Date(),
            guesses: [],
            status: "playing",
        }

        res.json({ id: wordle.id, length: wordle.word.length })

    } catch (error) {
        res.status(500).json( { error: error.message })
    }
}

export const submitGuess = async (req, res) => {
    try {
        const game = req.session.game
        const guess = req.body.guess?.toLowerCase()

        // Validation cases
        if (!game || game.wordleId !== Number(req.params.id)) {
            return res.status(400).json( { error: "No active game for this wordle"})
        }

        if(game.status !== "playing") {
            return res.status(400).json({ error: "Game is already over" })
        }

        if(!guess || guess.length !== game.answer.length) {
            return res.status(400).json({ error: `Guess must be ${game.answer.length} letters` })
        }

        if(!VALID_GUESSES.has(guess)) {
            return res.status(400).json({ error: "Not in word list" })
        }

        // scoring the word and remembering it
        const result = scoreGuess(guess, game.answer)
        game.guesses.push({ word: guess, result })

        // Did the game end?
        const won = result.every((r) => r === "correct")
        const lost = (!won && game.guesses.length === MAX_GUESSES)

        // updating the game's status below
        if(won) {
            game.status = "won"
        }
        else if(lost) {
            game.status = "lost"
        }


        // Inserting a user's attempt in the database, win or lose.
        if(game.status !== "playing") {
            await pool.query(
                `INSERT INTO solves (solver_id, wordle_id, mode, started_at, solved_at, num_of_guesses)
                VALUES ($1, $2, 'classic', $3, $4, $5)
                ON CONFLICT (solver_id, wordle_id, mode) DO NOTHING`,
                [req.user.id, game.wordleId, game.startedAt, new Date(), won ? game.guesses.length : MAX_GUESSES + 1]
            )
        }

        const response = { result, status: game.status }
        if(game.status !== "playing") {
            response.answer = game.answer
        }
        res.json(response)
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}