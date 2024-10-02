import { Routes, Route } from "react-router-dom";
import TeacherDashboard from "./TeacherDashboard";
import CreateAssignment from "./CreateAssignment";
import ViewAssignments from "./ViewAssignments";

const Teacher = () => {
  return (
    <Routes>
      <Route path="/" element={<TeacherDashboard />} />
      <Route path="submissions" element={<ViewAssignments />} />
      <Route path="assignment" element={<CreateAssignment />} />
    </Routes>
  );
};

export default Teacher;
