import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    name : {
        type : String,
    },
    code :{
        type : String,
        unique : true,
    },
    semester : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Semester"
    },
},{timestamps : true});

export const Subject = mongoose.model("Subject",subjectSchema);