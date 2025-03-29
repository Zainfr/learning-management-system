import express from "express"
import userRoute from './routes/userRoute.js';
import cors from "cors"
import { Student } from "./models/student.model.js";
import { Teacher } from "./models/teacher.models.js";
import { Semester } from "./models/sem.model.js";
import { Course } from "./models/course.model.js";
import assignmentRoutes from './routes/userRoute.js';
import path from 'path';
import authRoute from "./routes/authRoute.js";
import { Subject } from "./models/subjects.model.js";
import driveRoute from "./routes/driveRoute.js";
import lmsRoute from "./routes/lmsRoute.js";
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
app.use(express.urlencoded({extended: false}))

// Serve static files for uploaded assignments
app.use('/uploads', express.static('uploads'));

app.use('/public/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Routes
app.use('/', userRoute);
app.use('/api/assignments', assignmentRoutes); // Add assignment routes
app.use('/api/auth', authRoute);
app.use('/api/drive', driveRoute);
app.use('/api/lms', lmsRoute);


// to get the Teacher id for frontend.
app.get('/api/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find({}).populate('subjects').exec();
    res.json(teachers)
  } catch (error) {
    console.error('Error Fetching the Teachers : error');
    res.status(500).json({ message: ' Internal Server Error' });
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

app.get('/api/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find({});
    res.json(subjects);
  } catch (error) {
    console.error('Something Grave bad happened :', error);
    res.status(500).json({ message: 'Internal Server error' });
  }
})

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

// API Endpoint to get the number of Courses
app.get('/api/courses', async (req, res) => {
  try {
    const count = await Course.countDocuments({});
    const courses = await Course.find()
    res.json({
      count,
      courses
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default app;