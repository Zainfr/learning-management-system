import csvtojson from 'csvtojson';
import { Student } from '../models/student.model.js';
import { Semester } from '../models/sem.model.js';
import { Teacher } from '../models/teacher.models.js';
import { createStudentFolders } from './folderController.js';
import { assignMenteesToTeacher } from '../middlewares/assignMentee.js';
import bcrypt from 'bcrypt';

const importUserCsv = async (req, res) => {
    try {
        const jsonArray = await csvtojson().fromFile(req.file.path);

        const semesters = await Semester.find({}).populate('subjects');
        const semesterMap = new Map(semesters.map(s => [s.semester, s]));

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

            // Prepare the student data with hashed password
            const newStudent = {
                name: user.name,
                rollno: user.rollno,
                mobile: user.mobile,
                sem: semester._id, // Use the ObjectId of the semester
                mentor: mentor._id,
                email: user.email,
                password: hashedPassword, // Use the hashed password
            };

            // Create folders for the student
            try {
                createStudentFolders(newStudent, semester.subjects); // Ensure async handling
            } catch (folderError) {
                throw new Error(`Folder creation failed for student ${user.name}: ${folderError.message}`);
            }

            // Push the student data to the array
            userData.push(newStudent);
        }

        // Insert all student data into the database
        const insertedStudents = await Student.insertMany(userData);

        // Assign mentees to the mentor
        for (const student of insertedStudents) {
            const updatedTeacher = await assignMenteesToTeacher(student.mentor, student._id);
            if (updatedTeacher) {
                console.log(`Mentee assigned to teacher ${updatedTeacher.teacher_name}`);
            }
        }

        res.send({ status: 200, success: true, msg: 'Students Imported Successfully'});
    } catch (error) {
        console.error('Error during importing CSV:', error.message);
        res.status(400).send({ status: 400, success: false, msg: error.message });
    }
};

export default importUserCsv;
