import mongoose, { Mongoose } from "mongoose";

const adminSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        lowercase : true,
        required : true,
        unique : true,
    },
    mobile : {
        type : Number,
        required : true,
        unique : true,
    }
},{timestamps : true})

export const Admin = mongoose.model("Admin",adminSchema);