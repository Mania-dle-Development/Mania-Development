import express from "express";
import { getRandomClassicWordle, submitGuess } from "../controllers/wordles.js";
import { getRandomSwitcharooWordle, submitSwitcharooGuess } from "../controllers/switcharoo.js";

const router = express.Router();

// === TODO ===
// combine everything into two routes after all game modes are implemented
// `/:mode/random` to fetch a random wordle for that specific mode
// `/:mode/:id/guesses` to submit a guess for that specific mode

// open to guests too; only logged-in users get their solves saved (see controller)
router.get("/switcharoo/random", getRandomSwitcharooWordle);
router.post("/switcharoo/:id/guesses", submitSwitcharooGuess);
router.get("/random", getRandomClassicWordle);
router.post("/:id/guesses", submitGuess);

export default router;
