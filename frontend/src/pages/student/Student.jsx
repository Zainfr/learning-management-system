import { Routes, Route } from "react-router-dom";
import StudentDashboard from "./StudentDashboard";
import StudentExperiment from "./StudentExperiment";
import Notes from "./Notes";

const Student = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentDashboard />} />
      <Route path="assignments" element={<StudentExperiment />} />
      <Route path="/upload-assignment/:id" element={<Notes />} />
    </Routes>
  );
};

export default Student;
