import express from 'express'
import { addPasswordForGoogleLoginUser, fetchUser, redirectToPopupScreen } from '../controllers/authGoogleController.js'
import { isAuth } from '../middlewares/isAuth.js'

const router = express.Router()

router.get("/", redirectToPopupScreen)
router.get("/callback", fetchUser)
router.post("/add-password", isAuth, addPasswordForGoogleLoginUser)

export default router