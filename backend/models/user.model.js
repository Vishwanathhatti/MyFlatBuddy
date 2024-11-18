import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    resettoken:{
        type: String,
        default:'',
    }
})

const userModel= mongoose.model("User", userSchema)

export default userModel