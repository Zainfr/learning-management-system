import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
    course_name : {
        type : String,
        unique : true,
        required : false,
    },
    sem : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Semester",
    },
},{timestamps : true});

export const Course = mongoose.model("Course",courseSchema);