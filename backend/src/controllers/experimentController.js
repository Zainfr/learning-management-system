import { Student } from "../models/student.model.js";
import { upload } from "../middlewares/multer.js";
import path from "path";

export const uploadExperimentFile = async (req, res) => {
    try {
        // Log the request body to check if rollno is being passed correctly
        console.log("Request body:", req.body);
        const rollno = req.body.rollno || req.body.rollNo;
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

        // Update the student document
        const result = await Student.updateOne(
            { 
                rollno: rollno.toUpperCase(),
                "experiments.subject_name": subject_name 
            },
            { 
                $set: { 
                    "experiments.$.folder_path": path.dirname(filePath),
                    "experiments.$.filePath": filePath
                }
            }
        );

        // If no document was modified, it means the experiment doesn't exist yet
        if (result.modifiedCount === 0) {
            // Add a new experiment
            await Student.updateOne(
                { rollno: rollno.toUpperCase() },
                { 
                    $push: { 
                        experiments: {
                            subject_name: subject_name,
                            folder_path: path.dirname(filePath),
                            filePath: filePath
                        }
                    }
                }
            );
        }

        res.status(200).json({ success: true, message: "File uploaded successfully", filePath });
    } catch (error) {
        console.error("Error uploading experiment file:", error);
        res.status(500).json({ success: false, message: "Error uploading file", error: error.message });
    }
};

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
