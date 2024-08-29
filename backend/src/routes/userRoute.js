import express from "express";
import multer from "multer";
import path from "path";
import importUserCsv from "../controllers/csvController.js"; // Import the correct controller function
import importUserForm from "../controllers/formController.js";
import { Semester } from "../models/sem.model.js";
import { updateStudentByRollno, deleteStudentByRollno } from '../controllers/studentController.js';

const router = express.Router();

//router.use(bodyParser.urlencoded({ extended: true }));

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


// Update student route
router.put('/students/:rollno', updateStudentByRollno);

// Delete student route
router.delete('/students/:rollno', deleteStudentByRollno);

export default router;
