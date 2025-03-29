import express from 'express';
import { createBatch } from '../controllers/createBatchController.js';
import { getStudentsInBatch } from '../controllers/createBatchController.js';

const router = express.Router();

router.post('/create-batch', createBatch);
router.get('/get-students/:batchNo', getStudentsInBatch);

export default router;