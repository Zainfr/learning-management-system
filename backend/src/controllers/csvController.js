import csvtojson from 'csvtojson';
import fs from 'fs';
import path from 'path';
import { Student } from '../models/student.model.js';
import { Semester } from '../models/sem.model.js';
import { Subject } from '../models/subjects.model.js';

// Function to create student folders
const subjects = Subject;
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

// Function to handle CSV import and folder creation
const importUserCsv = async (req, res) => {
    try {
        const userData = [];
        const jsonArray = await csvtojson().fromFile(req.file.path);

        const semesters = await Semester.find({}).populate('subjects');
        const semesterMap = new Map(semesters.map(s => [s.semester, s]));

        for (const user of jsonArray) {
            const semester = semesterMap.get(Number(user.sem));
            
            if (!semester) {
                throw new Error(`Semester ${user.sem} not found in the database`);
            }

            // Prepare the student data
            const newStudent = {
                name: user.name,
                rollno: user.rollno,
                mobile: user.mobile,
                sem: semester._id, // Use the ObjectId of the semester
                mentor: user.mentor,
                email: user.email,
                password: user.password,
            };

            // Create folders for the student
            createStudentFolders(newStudent, semester.subjects);

            // Push the student data to the array
            userData.push(newStudent);
        }

        // Insert all student data into the database
        await Student.insertMany(userData);
        res.send({ status: 200, success: true, msg: 'CSV IMPORTED' });
    } catch (error) {
        res.status(400).send({ status: 400, success: false, msg: error.message });
    }
};

export default importUserCsv;
