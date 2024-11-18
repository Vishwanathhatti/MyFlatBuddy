import express from "express";
import mongoose, { connect } from "mongoose";
import cors from "cors";
import jsonwebtoken from "jsonwebtoken"
import userModel from "./models/user.model.js";
import userRouter from "./routes/user.route.js";
import connectDB from "./utils/db.js";
import { resetPassword } from "./controllers/user.controller.js";
import cookieParser from "cookie-parser";


const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors());


const router= express.Router()

app.use("/api/v1/user",userRouter)
router.route('/reset-password').post(resetPassword);

// Start the server
app.listen(3001, () => {
  connectDB()
  console.log("Server is running on port 3001");
});
