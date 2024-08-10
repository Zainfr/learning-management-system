import express from "express";
import multer from "multer";
import path from "path";
import bodyParser from "body-parser";
import importUser from "../controllers/adminController.js"; // Import the correct controller function

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.use(express.static(path.resolve('public')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join('..', '..', 'public', 'uploads')); // Ensure the correct path
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/importUser', upload.single('file'), importUser);

export default router;
