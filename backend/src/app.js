import express from "express"
import userRoute from './routes/userRoute.js';
import cors from "cors"
import { Student } from "./models/student.model.js";
import { Teacher } from "./models/teacher.models.js";
import { Semester } from "./models/sem.model.js";
const app = express();

// CORS middleware
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}
app.use(cors(corsOptions));

// Express JSON middleware
app.use(express.json());

// Routes
app.use('/', userRoute);


// to get the semester id for frontend
app.get('/api/semesters', async (req, res) => {
  try {
    const semesters = await Semester.find({});
    res.json(semesters);
  } catch (error) {
    console.error('Error fetching semesters:', error); // Log the error to the console
    res.status(500).json({ message: 'Internal server error' });
  }
});

//API endpoint for (to get sutdents)students
app.get('/api/students', async (req, res) => {
  //for paginatiuib
  const { page = 1, limit = 10 } = req.query;

  try {
    //pura chat gpt ne kiya yeh meko kuch nahi malom kya hai
    const students = await Student.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Student.countDocuments();

    res.json({
      students,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//delete student by their object id
app.delete('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.deleteOne();
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API Endpoint to get the number of students
app.get('/api/students/count', async (req, res) => {
  try {
    const count = await Student.countDocuments({});
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API Endpoint to get the number of teachers
app.get('/api/teachers/count', async (req, res) => {
  try {
    const count = await Teacher.countDocuments({});
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API Endpoint to get the list of courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default app;