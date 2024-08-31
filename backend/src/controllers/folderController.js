import fs from 'fs';
import path from 'path';
import { Subject } from '../models/subjects.model.js';

// Function to create student folders
const createStudentFolders = (student, subjects) => {
    const baseDir = path.join('.', 'public', 'uploads', student.rollno);
    const assignmentDir = path.join(baseDir, 'assignments');
    const materialsDir = path.join(baseDir, 'study-materials');

    // Create base directory
    fs.mkdirSync(baseDir, { recursive: true });

    // Create subject folders inside assignments
    subjects.forEach(subject => {
        fs.mkdirSync(path.join(assignmentDir, subject.name), { recursive: true });
    });

    // Create the study materials folder
    fs.mkdirSync(materialsDir, { recursive: true });

    // Return the paths (optional)
    return {
        assignmentFolderPath: assignmentDir,
        studyMaterialsFolderPath: materialsDir,
    };
};

export default createStudentFolders;