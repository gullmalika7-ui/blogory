import mongoose from "mongoose";
import validator from "validator";

const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    phone:{
        type: Number,
        required: true,
        unique: true,
    },
    
    password:{
        type: String,
        required: true,
        select: false,
    },
    token:{
        type: String,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
})
export const User = mongoose.model("User",userSchema);


