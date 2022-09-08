import express from "express";
const router = express.Router();
import { signup, login } from '../controllers/authController.js'

// Create a user
router.post("/signup", signup)

// Log in user 
router.post("/login", login)


router.post('/forgotpassword', userController.forgotPassword);
router.patch('/resetpassword/:token', userController.resetPassword);
export default router;