import { Routes, Route } from "react-router-dom";
import TeacherDashboard from "./TeacherDashboard";

const Teacher = () => {
  return (
    <Routes>
      <Route path="/:id" element={<TeacherDashboard />} />
    </Routes>
  );
};

export default Teacher;
