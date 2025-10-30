import express from "express"
import { getCoins } from "../controllers/currentController.js"

const router = express.Router()

router.get("/coins",getCoins)

export default router 