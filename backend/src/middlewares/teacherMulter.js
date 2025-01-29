// teacherMulter.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {v4 as uuid} from "uuid";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { teacher_name, teacher_subject_name } = req.params;
        
        const dir = path.join(
            "public/uploads",
            teacher_name,         
            "Study Materials",
            teacher_subject_name  
        );
        
        // Create directory if needed
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${uuid()}`
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const teacherUpload = multer({ storage });