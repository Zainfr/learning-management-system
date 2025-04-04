import mongoose, { Schema } from "mongoose";

const lectureSchema = new Schema({
    // sem : {
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref : "Semester",
    //     required : true
    // },
    // subject : {
    //     type : Schema.Types.ObjectId,
    //     ref : "Subject",
    //     required : true
    // },
    lecture_name : {
        type : String,
        trim : true,
        required : true,
    },
    lecture_type : {
        type : String,
        enum : ["Lecture","Lab","Other"],
        required : true,
    },
    date : {
        type : Date,
        default : Date.now,
        required : true,
    },
    batch : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Batch",
        required : true
    },
    teacher : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Teacher",
        required : true
    },

}, { timestamps: true });

export const Lecture = mongoose.model("Lecture", lectureSchema);