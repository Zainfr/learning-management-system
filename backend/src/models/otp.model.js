import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
    },
    otp : {
        type : String,
        required : true,
    },
    createdAt : {
        type : Date,
        default : Date.now,
        index : {expires : '10m'}
    }
});

export const Otp = mongoose.model('Otp',otpSchema);