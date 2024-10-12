import fs from "fs"
import path from "path"
import { Student } from "../models/student.model.js";

// Function to create student folders
export const createStudentFolders = async (student, subjects) => {
    const baseDir = path.join('.', 'public', 'uploads', student.rollno.toUpperCase());
    const assignmentDir = path.join(baseDir, 'assignments');

    // Create directories
    fs.mkdirSync(baseDir, { recursive: true });

    const experimentEntries = subjects.map(subject => ({
        subject_name: subject.name,  // Save name instead of ObjectId
        folder_path: path.join(assignmentDir, subject.name),
    }));

    // Save the experiment entries to the student in the database
    await Student.findByIdAndUpdate(student._id, {
        $set: { experiments: experimentEntries },
    });

    return { assignmentFolderPath: assignmentDir };
};

export const createTeacherFolder = async (teacher, subjects) => {
    const baseDir = path.join('.', 'public', 'uploads', teacher.teacher_name);
    const materialDir = path.join(baseDir, 'Study Materials');

    // Create base directory for the teacher
    fs.mkdirSync(baseDir, { recursive: true });

    // Loop through each subject and create folders
    subjects.forEach(subject => {
        const subjectFolder = path.join(materialDir, subject);  // Create folder for each subject
        fs.mkdirSync(subjectFolder, { recursive: true });
    });

    return {
        materialFolderPath: materialDir,
    };
};