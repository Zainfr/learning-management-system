// experimentRoutes.js
import express from "express";
import { upload } from "../middlewares/multer.js";  // Correct import of multer
import { uploadExperimentFile, getExperiments } from "../controllers/experimentController.js";

const router = express.Router();

// Route for uploading a file for an experiment (subject)
router.post("/upload/:rollno/:subject_name", upload.single('file'), uploadExperimentFile);


//Route to get all experiments for a student
router.get("/experiments/:rollno", getExperiments);

export default router;
