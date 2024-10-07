import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { rollno, subject_name } = req.params;

    // Check if studentRollno and subjectName are provided
    if (!rollno || !subject_name) {
      return cb(new Error("Student roll number and subject name are required"));
    }

    const uploadPath = path.join(".", "public", "uploads", rollno, "assignments", subject_name);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null,`${Date.now()}${ext}`);
  }
});

export const upload = multer({ storage });
