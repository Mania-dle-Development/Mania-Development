import express from "express"
import { getRandomClassicWordle, submitGuess } from "../controllers/wordles.js"

const router = express.Router()

// open to guests too; only logged-in users get their solves saved (see controller)
router.get("/random", getRandomClassicWordle)
router.post("/:id/guesses", submitGuess)

export default router
