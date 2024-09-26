import express from "express";
import multer from "multer";
import path from "path";
import bodyParser from "body-parser";
import importUserCsv from "../controllers/csvController.js"; // Import the correct controller function
import importUserForm from "../controllers/formController.js";
import { Semester } from "../models/sem.model.js";
import {importTeacherForm,importTeacherCsv , importAdmin} from "../controllers/teachers_Admin/teacherAdminController.js";
import { createCourse } from "../middlewares/courseCreation.js";
import { submitAssignment, getSubmissions, createAssignment } from '../controllers/assignmentController.js';
import { updateStudentByRollno } from "../controllers/studentController.js";
import { login } from "../middlewares/auth.js";
import { verifyToken } from "../middlewares/verifyToken.js";

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
router.post('/teacher-form-submit',importTeacherForm);
router.post('/teacher-csv-submit',upload.single('file'),importTeacherCsv);

//Create Admin
router.post('/admin-form-submit',importAdmin)

//Course Routing Starts here
router.post('/create-course',createCourse);

//Assignment Routes
router.post('/create', createAssignment);

// Configure multer for file uploads
const uploadd = multer({ dest: 'uploads/assignments/' });

// POST: Submit assignment
router.post('/:assignmentId/submit', uploadd.single('assignment'), submitAssignment);

// GET: Fetch all submissions for an assignment
router.get('/:assignmentId/submissions', getSubmissions);




// AUTH Routing Starts Here 
router.use('/login',login);

router.use('/admin', verifyToken(['Admin']), (req, res) => {
    // Admin route logic
    res.json({ message: 'Welcome, Admin!' });
});

router.use('/teacher', verifyToken(['Teacher']), (req, res) => {
    // Teacher route logic
    res.json({ message: 'Welcome, Teacher!' });
});

router.use('/student', verifyToken(['Student']), (req, res) => {
    // Student route logic
    res.json({ message: 'Welcome, Student!' });
});


export default router;
