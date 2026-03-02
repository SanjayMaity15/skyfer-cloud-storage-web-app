import express from 'express'
import { fetchUser, redirectToPopupScreen } from '../controllers/authGoogleController.js'

const router = express.Router()

router.get("/", redirectToPopupScreen)
router.get("/callback", fetchUser)

export default router