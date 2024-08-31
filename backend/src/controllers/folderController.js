import fs from "fs"
import path from "path"

// Function to create student folders
const createStudentFolders = (student, subjects) => {
    const baseDir = path.join('.', 'public', 'uploads', student.rollno);
    const assignmentDir = path.join(baseDir, 'assignments');
    
    //Study-materials commented Out bcoz it will be Provided by the Teacher
    //const materialsDir = path.join(baseDir, 'study-materials');

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

export default createStudentFolders;