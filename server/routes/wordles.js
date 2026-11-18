import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
	getWordles,
	getMyWordles,
	getWordleById,
	createWordle,
	updateWordle,
	deleteWordle,
	startClockGame,
	getRandomWordle,
	getWordleGame,
	submitGuess,
} from "../controllers/wordles.js";

const router = express.Router();

// `/clock/:id/start` starts the timer for clock mode
// `/:mode/random` to fetch a random wordle for that specific mode
// `/:mode/:id` to start a game for one specific wordle (must come AFTER /:mode/random)
// `/:id/guesses` to submit a guess for a wordle game (mode is saved in session data)
router.post("/clock/:id/start", startClockGame);
router.get("/:mode/random", getRandomWordle);
router.get("/:mode/:id", getWordleGame);
router.post("/:id/guesses", submitGuess);

// custom wordle routes (/me must come before /:id)
router.get("/me", requireAuth, getMyWordles);
router.get("/", getWordles);
router.get("/:id", getWordleById);
router.post("/", requireAuth, createWordle);
router.patch("/:id", requireAuth, updateWordle);
router.delete("/:id", requireAuth, deleteWordle);

export default router;
