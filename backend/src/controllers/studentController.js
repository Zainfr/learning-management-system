import { Student } from '../models/student.model.js';
import userRoute from './routes/userRoute.js';
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

app.put('/students/:rollno', updateStudentByRollno);


export const updateStudentByRollno = async (req, res) => {
    try {
        const { rollno } = req.params;
        const updateData = req.body;

        const student = await Student.findOneAndUpdate({ rollno }, updateData, { new: true });

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json({ success: true, student });
    } catch (error) {
        console.error("Error updating student:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


// Delete a student
export const deleteStudentByRollno = async (req, res) => {
    try {
        const { rollno } = req.params;

        const student = await Student.findOneAndDelete({ rollno });

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json({ success: true, msg: "Student deleted successfully" });
    } catch (error) {
        console.error("Error deleting student:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

  