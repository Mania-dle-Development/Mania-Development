import express from "express"
import { getProfileInformation } from "../controllers/profile.js"
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router()

//accessible only by users
router.get("/", requireAuth, getProfileInformation)

export default router