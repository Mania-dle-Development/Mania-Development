import express from "express"
import { requireAuth } from "../middleware/requireAuth.js"
import { getRandomWordle, submitGuess } from "../controllers/wordles.js"

const router = express.Router()

router.use(requireAuth) // guards every route below

router.get("/random", getRandomWordle)
router.post("/:id/guesses", submitGuess)

export default router