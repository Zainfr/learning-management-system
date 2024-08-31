import { Student } from "../models/student.model.js";
import { Semester } from '../models/sem.model.js';
import createStudentFolders from "./folderController.js";

const importUserForm = async (req, res) => {
  try {
    const { name, rollno, mobile, sem, mentor, email, password } = req.body;

    const semester = await Semester.findById(sem).populate('subjects');

    const newUser = new Student({
      name,
      rollno,
      mobile,
      sem,
      mentor,
      email,
      password,
    });
    // DONT REMOVE THIS TRY CATCH OR THE WORLD WILL END
    try {
      await newUser.save();
      createStudentFolders(newUser,semester.subjects);
    } catch (error) {
      console.error(error);
    }

    res.status(200).json({ success: true, msg: "User created successfully" });
    console.log('Received form data:', req.body);
  } catch (error) {
    if (error.code === 11000) {
      // This error code indicates a duplicate key error
      res.status(400).json({ success: false, msg: "Email or mobile number already exists" });
    } else {
      res.status(400).json({ success: false, msg: error.message });
    }
  }
};

export default importUserForm;