import { Teacher } from "../models/teacher.models.js";
import path from 'path'

export const uploadStudyMaterial = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const { teacher_name, teacher_subject_name } = req.params;
        const { email } = req.body;
        const file = req.file;

        console.log("Email", email, "File:", file, "Subject name:", teacher_subject_name);

        if (!teacher_name) {
            return res.status(400).json({ success: false, message: "teacher_name is missing" });
        }

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is missing" });
        }

        if (!teacher_subject_name) {
            return res.status(400).json({ success: false, message: "Subject name is missing" });
        }

        if (!file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        // Prepare the new file path
        const filePath = path.join("/public/uploads", teacher_name, "Study Materials", teacher_subject_name, file.filename);

        const teacher = await Teacher.findOne({ email });

        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher Not found" });
        }

        if (!teacher.study_material) {
            teacher.study_material = [];
        }

        teacher.study_material.push({
            subject_name: teacher_subject_name,
            filePath: filePath,
        })

        await teacher.save();

        res.status(200).json({ success: true, message: "File uploaded successfully", filePath });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ success: false, message: "Error uploading file", error: error.message });
    }
};

export const getStudyMaterial = async (req, res) => {
    try {
        const { email } = req.params;

        if (!email)
            return res.status(400).json({ success: false, message: "Faculty email not found" })

        const teacher = await Teacher.findOne({ email: email });

        if (!teacher)
            return res.status(404).json({ success: false, message: "Teacher not found" })

        const materialWithFiles = teacher.study_material.filter(mats => mats.filePath && mats.subject_name);

        const materialData = materialWithFiles.map(mats => ({
            _id: mats._id,
            subject_name: mats.subject_name,
            filePath: mats.filePath
        }))

        res.status(200).json({ success: true, materials: materialData })

    } catch (error) {
        console.error("Error getting Study Materials:", error);
        res.status(500).json({ success: false, message: "Error getting Study Materials", error: error.message });
    }
}