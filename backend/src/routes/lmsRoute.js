import express from 'express';
import { createBatch } from '../controllers/createBatchController.js';
import { getStudentsInBatch } from '../controllers/createBatchController.js';
import { createLecture, markAttendance } from '../controllers/LMS/attendanceController.js';

const router = express.Router();

router.post('/create-batch', createBatch);
router.get('/get-students/:batchNo', getStudentsInBatch);
router.post('/create-lecture',createLecture);
router.post('/mark-attendance',markAttendance);

export default router;