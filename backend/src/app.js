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

// to get the Teacher id for frontend.
app.get('/api/teachers',async(req,res) => {
  try {
    const teachers = await Teacher.find({});
    res.json(teachers)
  } catch (error) {
    console.error('Error Fetching the Teachers : error');
    res.status(500).json({message: ' Internal Server Error'});
  }
})

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
  try {
    //pura chat gpt ne kiya yeh meko kuch nahi malom kya hai
    const students = await Student.find()

    const count = await Student.countDocuments();

    res.json({
      students,
      count
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//API endpoint to get teacher details
app.get('/api/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find()
    res.json({
      teachers,
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

//delete teacher by their object id
app.delete('/api/teachers/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    await teacher.deleteOne();
    res.json({ message: 'Teacehr deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//Yeh mat hatao bhai pleaseeeeeeeeeeee 
// API Endpoint to get the number of teachers
app.get('/api/teachers/count', async (req, res) => {
  try {
    const count = await Teacher.countDocuments({});
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default app;