// experimentRoutes.js
import express from "express";
import { upload } from "../middlewares/multer.js";  // Correct import of multer
import { teacherUpload } from "../middlewares/teacherMulter.js";
import { uploadExperimentFile, getExperiments, getExperimentsBySubject, kamchalu } from "../controllers/experimentController.js";
import { uploadStudyMaterial, getStudyMaterial } from "../controllers/studyMaterialController.js";

const router = express.Router();

// Route for uploading a file for an experiment (subject)
router.post("/student/upload/:rollno/:subject_name", upload.single('file'), uploadExperimentFile);

router.post("/teacher/upload/:teacher_name/:teacher_subject_name", teacherUpload.single('file'), uploadStudyMaterial)

//Route to get all experiments for a student
router.get("/experiments/:rollno", getExperiments);
router.get("/materials/:email", getStudyMaterial)
router.get("/subject/:studentId/experiments/:subject_name", getExperimentsBySubject)
router.get("/kamchalu/:rollno", kamchalu);

export default router;
