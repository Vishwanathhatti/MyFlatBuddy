import express from "express"
import { register, login, forgotPassword, resetPassword, logout, updateProfile } from "../controllers/user.controller.js"
import isAuth from "../middlewares/isAuth.js"

const userRouter= express.Router()

userRouter.route("/signup").post(register)
userRouter.route("/login").post(login)
userRouter.route("/profile/update").post(isAuth, updateProfile)
userRouter.route("/forgot-password").post(forgotPassword)
userRouter.route('/reset-password').post(resetPassword)
userRouter.route('/logout').get(logout)
export default userRouter