import express from "express";
import {
	getWordles,
	getMyWordles,
	getWordleById,
	createWordle,
	updateWordle,
	deleteWordle,
} from "../controllers/wordles.js";

const router = express.Router();

// blocks the request if the user isn't logged in
const requireLogin = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.status(401).json({ error: "You need to log in first." });
};

router.get("/", getWordles);
router.get("/mine", requireLogin, getMyWordles); // must come before /:id
router.get("/:id", getWordleById);
router.post("/", requireLogin, createWordle);
router.patch("/:id", requireLogin, updateWordle);
router.delete("/:id", requireLogin, deleteWordle);

export default router;