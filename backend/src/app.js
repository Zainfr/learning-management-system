import express from "express"
import userRoute from './routes/userRoute.js';
import cors from "cors"

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


export default app;