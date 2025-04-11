import express from "express";
import multer from "multer";
import path from "path";
import { Student } from "../models/student.model.js";
import bodyParser from "body-parser";
import importUserCsv from "../controllers/csvController.js"; // Import the correct controller function
import importUserForm from "../controllers/formController.js";
import { Semester } from "../models/sem.model.js";
import { importTeacherForm, importTeacherCsv, importAdmin, getTeacher } from "../controllers/teachers_Admin/teacherAdminController.js";
import { createCourse } from "../middlewares/courseCreation.js";
import { submitAssignment, getSubmissions, createAssignment, getAllAssignments, getOneAssignment } from '../controllers/assignmentController.js';
import { updateStudentByRollno, getStudent } from "../controllers/studentController.js";

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.use(express.static(path.resolve('public')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join('.', '.', 'public', 'uploads')); // Ensure the correct path
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
//Student Routing Starts here
router.post('/importUser', upload.single('file'), importUserCsv); //Handles CSV

router.post('/form-submit', importUserForm);                       //Handles Form Submission

router.get('/', async (req, res) => {
    try {
        const semesters = await Semester.find({});
        res.json(semesters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/students/:rollno', updateStudentByRollno);

//teacher Routing starts here
router.post('/teacher-form-submit', importTeacherForm);
router.post('/teacher-csv-submit', upload.single('file'), importTeacherCsv);

//Create Admin
router.post('/admin-form-submit', importAdmin)

//Course Routing Starts here
router.post('/create-course', createCourse);

//Assignment Routes
router.post('/create', createAssignment);
//fetch assignment
router.get('/assignments', getAllAssignments);
router.get('/:assignmentId/assignment', getOneAssignment);

// Configure multer for file uploads
const uploadd = multer({ dest: 'uploads/assignments/' });

// POST: Submit assignment
router.post('/:assignmentId/submit', uploadd.single('assignment'), submitAssignment);

// GET: Fetch all submissions for an assignment
router.get('/:assignmentId/submissions', getSubmissions);

//Fetch single user routes
router.get('/api/teacher/:id', getTeacher);
router.get('/api/student/:id', getStudent);

router.get('/api/student/rollno/:rollno', async (req, res) => {
    try {
        const student = await Student.findOne({ rollno: req.params.rollno });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default router;
