import express from "express";
import mongoose, { connect } from "mongoose";
import cors from "cors";
import jsonwebtoken from "jsonwebtoken"
import userModel from "./models/user.model.js";
import userRouter from "./routes/user.route.js";
import connectDB from "./utils/db.js";
import { resetPassword } from "./controllers/user.controller.js";
import cookieParser from "cookie-parser";
import 'dotenv/config'

const app = express();
app.use(express.json());
app.use(cookieParser());
const corsOptions= {
  origin:'http://localhost:5173',
  credentials: true
}
app.use(cors(corsOptions));


const router= express.Router()

app.use("/api/v1/user",userRouter)
router.route('/reset-password').post(resetPassword);


const PORT= process.env.PORT || 3001
// Start the server
app.listen(PORT, () => {
  connectDB()
  console.log("Server is running on PORT", PORT);
});
