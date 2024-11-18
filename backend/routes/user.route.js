import express from "express"
import { register, login, forgotPassword, resetPassword } from "../controllers/user.controller.js"

const userRouter= express.Router()

userRouter.route("/signup").post(register)
userRouter.route("/login").post(login)
userRouter.route("/forgot-password").post(forgotPassword)
userRouter.route('/reset-password').post(resetPassword)
export default userRouter