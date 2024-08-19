import mongoose from "mongoose";

// Define the Semester schema
const semesterSchema = new mongoose.Schema({
    semester: {
        type: Number,
        required: true,
        unique: false,
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref : "Subjects",
        required: true,
    }],
}, {timestamps: true});

export const Semester = mongoose.model("Semester", semesterSchema);