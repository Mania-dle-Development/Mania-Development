import express from "express"
import { getRandomClassicWordle, submitGuess } from "../controllers/wordles.js"
import { getRandomClockWordle, startClockGame, submitClockGuess } from "../controllers/clock.js"

const router = express.Router()

// open to guests too; only logged-in users get their solves saved (see controller)
router.get("/clock/random", getRandomClockWordle)
router.post("/clock/:id/start", startClockGame)
router.post("/clock/:id/guesses", submitClockGuess)
router.get("/random", getRandomClassicWordle)
router.post("/:id/guesses", submitGuess)

export default router
