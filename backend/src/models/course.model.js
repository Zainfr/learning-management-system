import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true,
    },
}, { timestamps: true })


export const Course = mongoose.model("Course", courseSchema);