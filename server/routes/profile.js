import express from "express"
import { getProfileInformation } from "../controllers/profile.js"

const router = express.Router()

//accessible only by users
router.get("/profile", getProfileInformation)

export default router