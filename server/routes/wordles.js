import express from "express";
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

const router = express.Router();

// blocks the request if the user isn't logged in
const requireLogin = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.status(401).json({ error: "You need to log in first." });
};

// these must come before /:id
router.get("/random", getRandomClassicWordle); // open to guests; only logged-in solves are saved
router.get("/mine", requireLogin, getMyWordles);

router.get("/", getWordles);
router.get("/:id", getWordleById);
router.post("/", requireLogin, createWordle);
router.post("/:id/guesses", submitGuess);
router.patch("/:id", requireLogin, updateWordle);
router.delete("/:id", requireLogin, deleteWordle);

export default router;