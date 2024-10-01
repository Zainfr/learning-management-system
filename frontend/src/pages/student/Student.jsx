import { Routes, Route } from "react-router-dom";
import StudentDashboard from "./StudentDashboard";
import StudentExperiment from "./StudentExperiment";
import Notes from "./Notes";

const Student = () => {
  return (
    <Routes>
      <Route path="/:id" element={<StudentDashboard />} />
      <Route path="/assignments/:id" element={<StudentExperiment />} />
      <Route path="/upload-assignment/:id" element={<Notes />} />
    </Routes>
  );
};

export default Student;
