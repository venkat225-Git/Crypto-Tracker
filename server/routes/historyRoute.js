import express from "express"
import fetchhistory from "../controllers/historyController.js"

const router = express.Router()

router.post("/history",fetchhistory)

export default router  