import { Student } from '../models/student.model.js';

export const updateStudentByRollno = async (req, res) => {
    try {
        const { rollno } = req.params;
        const updateData = req.body;

        const student = await Student.findOneAndUpdate({ rollno }, updateData, { new: true });

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json({ success: true, student });
    } catch (error) {
        console.error("Error updating student:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};