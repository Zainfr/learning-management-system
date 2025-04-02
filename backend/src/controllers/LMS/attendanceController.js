import { Attendance } from "../../models/LMS/attendance.model.js";
import { Batch } from "../../models/LMS/batch.model.js";
import { Lecture } from "../../models/LMS/lecture.model.js";
import { Student } from "../../models/student.model.js";


export const createLecture = async (req, res) => {
    const { lecture_name, lecture_type, date, batch, teacher } = req.body;

    try {
        const doesBatchExists = await Batch.findById(batch);
        if (!doesBatchExists) {
            return res.status(400).json({ success: false, message: "Batch not found" });
        }

        const lecture = await Lecture.create({
            lecture_name,
            lecture_type,
            date,
            batch,
            teacher
        })
        if (!lecture) {
            return res.status(400).json({ success: false, message: "There was a Error creating the lecture" });
        }

        return res.status(201).json({ success: true, message: "Lecture created successfully", lecture });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const markAttendance = async (req, res) => {
    const { batchId, lectureId, absentRollnos, markedBy } = req.body;

    console.log("Batch ID:", batchId);
    console.log("Lecture ID:", lectureId);
    console.log("Absent Roll Numbers:", absentRollnos);


    try {
        const doesLectureExists = await Lecture.findById(lectureId);
        if (!doesLectureExists) {
            return res.status(400).json({ success: false, message: "Lecture/Lab not found" });
        }

        const batchStudents = await Student.find({ batch: batchId });
        if (batchStudents.length === 0) {
            return res.status(404).json({ success: false, message: "No students found in this batch" });
        }
        console.log(batchStudents.length);
        const absentRollnosToUpperCase = absentRollnos.map((rollno) => rollno.toUpperCase());

        const attendanceRecord = [];

        let presentCount = 0;
        let absentCount = 0;
        const errors = [];

        for (const student of batchStudents) {
            const isAbsent = absentRollnosToUpperCase.includes(student.rollno);

            const attendanceObj = {
                lecture: lectureId,
                student: student._id,
                status: isAbsent ? 'Absent' : 'Present',
                markedby: markedBy,
            }

            attendanceRecord.push(attendanceObj);

            if (isAbsent) {
                absentCount++;
            } else {
                presentCount++;
            }
        }

        try {
            await Attendance.insertMany(attendanceRecord, { ordered: false });
        } catch (err) {
            if (err.code === 11000) {
                errors.push({ message: "Attendance already marked for this student" });
            } else {
                console.error("Error inserting attendance:", err);
                errors.push({ message: "Error marking attendance" });
            }
        }
        // if (batchStudents.length > 0) {
        //     try {
        //         const singleRecord = new Attendance({
        //             lecture: lectureId,
        //             student: batchStudents[0]._id,
        //             status: 'Present',
        //             markedBy: markedBy
        //         });
        //         await singleRecord.save();
        //         console.log("Manual single record saved successfully");
        //     } catch (singleInsertError) {
        //         console.error("Manual single insert failed:", singleInsertError);
        //     }
        // }


        return res.status(201).json({ success: true, message: "Attendance marked successfully" });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}