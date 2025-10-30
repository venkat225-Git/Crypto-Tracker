import express from "express"
import getCoins from "../controllers/currentController"

const router = express.Router()

router.get("/coins",getCoins)

export default router 