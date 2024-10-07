import { Student } from "../models/student.model.js";
import { Semester } from '../models/sem.model.js';
import { createStudentFolders } from "./folderController.js";
import { assignMenteesToTeacher } from '../middlewares/assignMentee.js';
import { Teacher } from "../models/teacher.models.js";
// import { assignSubjectsToStudent } from "../middlewares/semOperations.js";

const importUserForm = async (req, res) => {
  try {
    const { name, rollno, mobile, sem, mentor, email, password } = req.body;

    const semester = await Semester.findById(sem).populate('subjects');
    if (!semester) {
      return res.status(404).json({ success: false, message: "Semester not found" });
    }

    const newUser = new Student({
      name,
      rollno,
      mobile,
      sem,
      mentor,
      email,
      password,
    });

    try {
      await newUser.save();
      createStudentFolders(newUser, semester.subjects);
      // assignSubjectsToStudent(newUser._id, semester._id);

      console.log('Mentor (teacher ID):', mentor);  // Check mentor ID
      
      // Check if the teacher exists
      const teacherExists = await Teacher.findById(mentor);
      if (!teacherExists) {
        console.error("No teacher found with ID:", mentor);
        return res.status(404).json({ success: false, message: "Teacher not found" });
      }

      const updatedTeacher = await assignMenteesToTeacher(mentor, newUser._id); // Pass mentor as ObjectId
      if (updatedTeacher) {
        console.log("Updated Teacher:", updatedTeacher);
      }

    } catch (error) {
      console.error("Error in creating student or assigning mentees:", error);
      return res.status(500).json({ success: false, msg: error.message });
    }

    res.status(200).json({ success: true, msg: "User created successfully" });
    console.log('Received form data:', req.body);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Email or mobile number already exists" });
    } else {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
};

export default importUserForm;
