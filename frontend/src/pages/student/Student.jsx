import { Routes, Route } from "react-router-dom";
import StudentDashboard from "./StudentDashboard";

const Student = () => {
  return (
    <Routes>
      <Route path="/:id" element={<StudentDashboard />} />
    </Routes>
  );
};

export default Student;
