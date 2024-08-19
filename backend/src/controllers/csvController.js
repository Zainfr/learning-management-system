import csvtojson from "csvtojson";
import { Student } from "../models/student.model.js";
import { Semester } from "../models/sem.model.js";

const importUserCsv = async (req, res) => {
  try {
    const userData = [];
    // Parse CSV file to JSON
    const jsonArray = await csvtojson().fromFile(req.file.path);

    // First, let's get all semesters from the database
    const semesters = await Semester.find({});
    const semesterMap = new Map(semesters.map(s => [s.semester, s._id]));

    // Prepare user data for insertion
    for (const user of jsonArray) {
      // Find the corresponding semester ObjectId
      const semesterId = semesterMap.get(Number(user.sem));
      
      if (!semesterId) {
        throw new Error(`Semester ${user.sem} not found in the database`);
      }

      userData.push({
        name: user.name,
        rollno: user.rollno,
        mobile: user.mobile,
        sem: semesterId, // Use the ObjectId instead of the semester number
        mentor: user.mentor,
        email: user.email,
        password: user.password,
      });
    }

    // Insert user data into the database
    await Student.insertMany(userData);
    res.send({ status: 200, success: true, msg: "CSV IMPORTED" });
  } catch (error) {
    res.status(400).send({ status: 400, success: false, msg: error.message });
  }
};

export default importUserCsv;