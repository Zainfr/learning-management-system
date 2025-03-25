import mongoose from "mongoose";
import { Student } from "../models/student.model.js";
import path from "path";

export const uploadExperimentFile = async (req, res) => {
    try {
        const rollno = req.body.rollno?.toUpperCase() || req.body.rollNo?.toUpperCase();
        const { subject_name } = req.params;
        const file = req.file;

        // Log the parameters to make sure they are coming through
        console.log("Roll number:", rollno, "File:", file, "Subject name:", subject_name);

        // Check if the required fields are present
        if (!rollno) {
            return res.status(400).json({ success: false, message: "Roll number is missing" });
        }

        if (!subject_name) {
            return res.status(400).json({ success: false, message: "Subject name is missing" });
        }

        if (!file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        // Prepare the new file path
        const filePath = path.join("/public/uploads", rollno.toUpperCase(), "assignments", subject_name, file.filename);

        const student = await Student.findOne({ rollno });

        if (!student)
            return res.status(404).json({ success: false, message: "Student not found" })

        if (!student.experiments) {
            student.experiments = []
        }
        student.experiments.push({
            subject_name: subject_name,
            filePath: filePath
        })

        await student.save();;

        res.status(200).json({ success: true, message: "File uploaded successfully", filePath });
    } catch (error) {
        console.error("Error uploading experiment file:", error);
        res.status(500).json({ success: false, message: "Error uploading file", error: error.message });
    }
};

//YEH USE KR IN ViewExperiment.jsx
export const getExperiments = async (req, res) => {
    try {
        const { rollno } = req.params;

        // Check if rollno is provided
        if (!rollno) {
            return res.status(400).json({ success: false, message: "Roll number is missing" });
        }

        const student = await Student.findOne({ rollno: rollno.toUpperCase() });

        // Check if the student is found
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        // Filter experiments to include only those with a filePath
        const experimentsWithFiles = student.experiments.filter(exp => exp.folder_path);

        // Map the filtered experiments to include only necessary information
        const experimentsData = experimentsWithFiles.map(exp => ({
            _id: exp._id,
            subject_name: exp.subject_name,
            filePath: exp.filePath
        }));

        res.status(200).json({ success: true, experiments: experimentsData });
    } catch (error) {
        console.error("Error getting experiments:", error);
        res.status(500).json({ success: false, message: "Error getting experiments", error: error.message });
    }
}

//YEH USE KR IN ViewSpecificExperiment.jsx
export const getExperimentsBySubject = async (req, res) => {
    try {
        const { studentId, subject_name } = req.params;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ success: false, message: "Invalid Student Id" })
        }
        if (!subject_name || typeof subject_name !== 'string') {
            return res.status(400).json({ success: false, message: "Valid subject name is required" })
        }

        const student = await Student.findById(studentId);

        if (!student)
            return res.status(404).json({ success: false, message: "student not found" })

        const experiments = student.experiments.filter(exp =>
            exp.subject_name == subject_name && exp.filePath
        );

        if (experiments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No experiments found for this subject"
            });
        }

        res.status(200).json({
            success: true,
            experiments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching experiments",
            error: error.message
        });
    }
}

export const kamchalu = async (req, res) => {
    try {
        const { rollno } = req.params;

        // Check if rollno is provided
        if (!rollno) {
            return res.status(400).json({ success: false, message: "Roll number is missing" });
        }

        const student = await Student.findOne({ rollno: rollno.toUpperCase() });

        // Check if the student is found
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        // Filter experiments to include only those with a filePath
        const experimentsWithFiles = student.experiments.filter(exp => exp.filePath);

        // Map the filtered experiments to include only necessary information
        const experimentsData = experimentsWithFiles.map(exp => ({
            _id: exp._id,
            subject_name: exp.subject_name,
            filePath: exp.filePath
        }));

        res.status(200).json({ success: true, experiments: experimentsData });
    } catch (error) {
        console.error("Error getting experiments:", error);
        res.status(500).json({ success: false, message: "Error getting experiments", error: error.message });
    }
}