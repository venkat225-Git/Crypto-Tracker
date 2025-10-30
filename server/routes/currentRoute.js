import express from "express"
import fetchdata from "../controllers/currentController.js"

const router = express.Router()

router.get("/coins",fetchdata)

export default router 