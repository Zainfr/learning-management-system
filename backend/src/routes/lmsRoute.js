import express from 'express';
import { createBatch, getBatches,getStudentsInBatch } from '../controllers/createBatchController.js';
import { createLecture, getAttendanceStatistic, getLectures, getSubjectAttendance, markAttendance } from '../controllers/LMS/attendanceController.js';

const router = express.Router();

//Batch routes
router.post('/create-batch', createBatch);
router.get('/get-batches/:department/:semester',getBatches);
router.get('/get-students/:batchNo', getStudentsInBatch);

//Lecture Routes
router.post('/create-lecture',createLecture);
router.get('/get-lectures', getLectures);

//Attendance Routes
router.post('/mark-attendance',markAttendance);
router.get('/attendance-statistics/:lectureId',getAttendanceStatistic);
router.get('/student-attendance/:studentId',getSubjectAttendance)


export default router;