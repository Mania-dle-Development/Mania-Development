import express from "express"
import { requireAuth } from "../middleware/requireAuth.js"
import { getRandomClassicWordle, submitGuess } from "../controllers/wordles.js"

const router = express.Router()

router.use(requireAuth) // guards every route below

router.get("/random", getRandomClassicWordle)
router.post("/:id/guesses", submitGuess)

export default router