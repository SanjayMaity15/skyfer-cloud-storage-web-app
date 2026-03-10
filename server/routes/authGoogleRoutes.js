import express from 'express'
import { addPasswordForGoogleLoginUser, loginWithGoogle } from '../controllers/authGoogleController.js'
import { isAuth } from '../middlewares/isAuth.js'

const router = express.Router()


router.post("/google", loginWithGoogle)
router.post("/add-password", isAuth, addPasswordForGoogleLoginUser)

export default router