import csvtojson from 'csvtojson';
import { Student } from '../models/student.model.js';
import { Semester } from '../models/sem.model.js';
import { Teacher } from '../models/teacher.models.js';
import { Batch } from '../models/LMS/batch.model.js'; // Import Batch model
import { createStudentFolders } from './folderController.js';
import { assignMenteesToTeacher } from '../middlewares/assignMentee.js';
import bcrypt from 'bcrypt';

/*
How this function works after working on it for 7 years and 29 months ?

1. setup the csvtojson package.
2. populate the Semester Document with the Subjects..
3. make a loop to see the data from the CSV exists in the database or not.
4. after checking , it creates a object which holds all the new students. This object is then inserted in the database
5. folders for each student is created.
6. mentees are assigned then to the mentors. 
7. assigning batch to students if available in CSV.
*/
const importUserCsv = async (req, res) => {
    try {
        const jsonArray = await csvtojson().fromFile(req.file.path);

        const semesters = await Semester.find({}).populate('subjects');
        const semesterMap = new Map(semesters.map(s => [s.semester, s]));

        // Find all batches
        const batches = await Batch.find({});
        const batchMap = new Map();
        
        // Create a map of batches for easy lookup
        batches.forEach(batch => {
            const key = `${batch.batchNo}-${batch.semester}`;
            batchMap.set(key, batch._id);
        });

        const userData = [];

        for (const user of jsonArray) {
            const semester = semesterMap.get(Number(user.sem));
            if (!semester) {
                throw new Error(`Semester ${user.sem} not found in the database`);
            }

            const mentor = await Teacher.findOne({ teacher_name: user.mentor });
            if (!mentor) {
                throw new Error(`Teacher ${user.mentor} not found in the Database`);
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(user.password, 10);

            // Prepare student data with hashed password
            const newStudent = {
                name: user.name,
                rollno: user.rollno,
                mobile: user.mobile,
                sem: semester._id, // Use ObjectId
                mentor: mentor._id,
                email: user.email,
                password: hashedPassword,
            };
            
            // If batchNo exists in CSV, try to find the batch
            if (user.batchNo) {
                const batchKey = `${user.batchNo}-${semester._id}`;
                const batchId = batchMap.get(batchKey);
                
                if (batchId) {
                    newStudent.batch = batchId;
                } else {
                    // If batch doesn't exist, throw error
                    throw new Error(`Batch with batchNo ${user.batchNo} for semester ${user.sem} not found in the Database`);
                }
            }

            userData.push(newStudent);
        }

        // Insert all students at once and capture the response
        const insertedStudents = await Student.insertMany(userData);

        // Create folders for all inserted students
        for (const student of insertedStudents) {
            const semester = semesterMap.get(Number(jsonArray.find(u => u.rollno === student.rollno).sem));
            
            // Ensure folder creation is handled correctly
            try {
                await createStudentFolders(student, semester.subjects);
            } catch (folderError) {
                console.error(`Folder creation failed for student ${student.name}: ${folderError.message}`);
            }

            // Assign mentees to their respective mentors
            const updatedTeacher = await assignMenteesToTeacher(student.mentor, student._id);
            if (updatedTeacher) {
                console.log(`Mentee assigned to teacher ${updatedTeacher.teacher_name}`);
            }
        }

        res.send({ status: 200, success: true, msg: 'Students Imported Successfully' });
    } catch (error) {
        console.error('Error during importing CSV:', error.message);
        res.status(400).send({ status: 400, success: false, msg: error.message });
    }
};

export default importUserCsv;