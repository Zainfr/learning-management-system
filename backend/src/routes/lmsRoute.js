import express from 'express';
import { createBatch, getBatches } from '../controllers/createBatchController.js';
import { getStudentsInBatch } from '../controllers/createBatchController.js';
import { createLecture, getAttendanceStatistic, getLectures, markAttendance } from '../controllers/LMS/attendanceController.js';

const router = express.Router();

router.post('/create-batch', createBatch);
router.post('/create-lecture',createLecture);
router.post('/mark-attendance',markAttendance);

router.get('/get-lectures/:batchId', getLectures);
router.get('/get-batches/:department/:semester',getBatches);
router.get('/get-students/:batchNo', getStudentsInBatch);
router.get('/attendance-statistics/:lectureId',getAttendanceStatistic);

export default router;