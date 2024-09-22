import fs from "fs"
import path from "path"

// Function to create student folders
export const createStudentFolders = (student, subjects) => {
    const baseDir = path.join('.', 'public', 'uploads', student.rollno);
    const assignmentDir = path.join(baseDir, 'assignments');

    // Create base directory
    fs.mkdirSync(baseDir, { recursive: true });

    // Create subject folders inside assignments
    subjects.forEach(subject => {
        fs.mkdirSync(path.join(assignmentDir, subject.name), { recursive: true });
    });

    // Return the paths (optional)
    return {
        assignmentFolderPath: assignmentDir,
    };
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