import { Course } from "../models/course.model.js";
import mongoose from 'mongoose'

export const createCourse = async (req, res ) => {
    try {
        const { course_name, sem } = req.body;

        if(!mongoose.Types.ObjectId.isValid(sem)){
            return res.status(400).json({message : "Invalid Semester ID"})
        }
        const newCourse = new Course({
            course_name,
            sem,
        });
        await newCourse.save();
        console.log(req.body);
        res.status(200).json({
            message: "Course created successfully",
            course: newCourse
        });
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
