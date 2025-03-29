import { Batch } from "../models/batch.model.js";

export const createBatch = async (req, res) => {
    try {
        const { batchNo, department, semester } = req.body;

        const newBatch = new Batch({
            batchNo,
            department,
            semester,
        });
        await newBatch.save();
        res.status(200).json({ success: true, msg: "Batch Created Successfully" });
        console.log("Recieved Form Data : ", req.body);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ success: false, msg: "Batch already exists" });
        } else {
            res.status(400).json({ success: false, msg: error.message });
        }
    }
}