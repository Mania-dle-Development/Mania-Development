import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
	getWordles,
	getMyWordles,
	getWordleById,
	createWordle,
	updateWordle,
	deleteWordle,
	getRandomClassicWordle,
	submitGuess,
} from "../controllers/wordles.js";
import { getRandomSwitcharooWordle, submitSwitcharooGuess } from "../controllers/switcharoo.js";
import { getRandomClockWordle, startClockGame, submitClockGuess } from "../controllers/clock.js";

const router = express.Router();

// === TODO ===
// combine everything into two routes after all game modes are implemented
// `/:mode/random` to fetch a random wordle for that specific mode
// `/:mode/:id/guesses` to submit a guess for that specific mode

// game routes: open to guests too; only logged-in users get their solves saved (see controller)
router.get("/switcharoo/random", getRandomSwitcharooWordle);
router.post("/switcharoo/:id/guesses", submitSwitcharooGuess);
router.get("/clock/random", getRandomClockWordle);
router.post("/clock/:id/start", startClockGame);
router.post("/clock/:id/guesses", submitClockGuess);
router.get("/random", getRandomClassicWordle);
router.post("/:id/guesses", submitGuess);

// custom wordle routes (/me must come before /:id)
router.get("/me", requireAuth, getMyWordles);
router.get("/", getWordles);
router.get("/:id", getWordleById);
router.post("/", requireAuth, createWordle);
router.patch("/:id", requireAuth, updateWordle);
router.delete("/:id", requireAuth, deleteWordle);

export default router;