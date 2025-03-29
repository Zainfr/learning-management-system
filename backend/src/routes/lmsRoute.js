import express from 'express';
import { createBatch } from '../controllers/createBatchController.js';

const router = express.Router();

router.post('/create-batch',createBatch);

export default router;