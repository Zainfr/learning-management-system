import { Batch } from "../models/batch.model.js";
import { Student } from "../models/student.model.js";

export const createBatch = async (req, res) => {
    try {
        const { batchNo, department, semester } = req.body;

        const newBatch = new Batch({
            batchNo,
            department,
            semester,
        });
        await newBatch.save();
        res.status(200).json({ success: true, msg: "Batch Created Successfully" });
        console.log("Recieved Form Data : ", req.body);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ success: false, msg: "Batch already exists" });
        } else {
            res.status(400).json({ success: false, msg: error.message });
        }
    }
}

export const getStudentsInBatch = async (req, res) => {
    try {
        const { batchNo } = req.params;

        // Find the batch document by batchNo
        const batch = await Batch.findOne({ batchNo: batchNo });

        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }

        // Find students associated with the batch
        const students = await Student.find({ batch: batch._id })
        .populate("sem", "name")  // Populating Semester Name
        .select("name rollno mobile sem");
        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};