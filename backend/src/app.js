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

app.get('/api/semesters', async (req, res) => {
  try {
    const semesters = await Semester.find({});
    res.json(semesters);
  } catch (error) {
    console.error('Error fetching semesters:', error); // Log the error to the console
    res.status(500).json({ message: 'Internal server error' });
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