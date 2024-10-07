// experimentRoutes.js
import express from "express";
import { upload } from "../middlewares/multer.js";  // Correct import of multer
import { uploadExperimentFile } from "../controllers/experimentController.js";

const router = express.Router();

// Route for uploading a file for an experiment (subject)
router.post("/upload/:rollno/:subject_name", upload.single('file'), uploadExperimentFile);

export default router;
