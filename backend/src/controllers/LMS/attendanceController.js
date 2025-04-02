import { Attendance } from "../../models/LMS/attendance.model.js";
import { Batch } from "../../models/LMS/batch.model.js";
import { Lecture } from "../../models/LMS/lecture.model.js";


export const createLecture = async (req, res) => {
    const { lecture_name, lecture_type, date, batch, teacher } = req.body;

    try {
        const doesBatchExists = await Batch.findById(batch);
        if(!doesBatchExists){
            return res.status(400).json({success : false, message : "Batch not found"});
        }

        const lecture = await Lecture.create({
            lecture_name,
            lecture_type,
            date,
            batch,
            teacher
        })
        if(!lecture){
            return res.status(400).json({success : false,message : "There was a Error creating the lecture"});
        }

        return res.status(201).json({success : true,message : "Lecture created successfully",lecture});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success : false,message : "Internal Server Error"});
    }
}