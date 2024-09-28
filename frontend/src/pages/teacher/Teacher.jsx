import { Routes, Route } from "react-router-dom";
import TeacherDashboard from "./TeacherDashboard";
import CreateAssignment from "./CreateAssignment";
import ViewAssignments from "./ViewAssignments";

const Teacher = () => {
  return (
    <Routes>
      <Route path="/:id" element={<TeacherDashboard />} />
      <Route path="/submissions/:id" element={<ViewAssignments />} />
      <Route path="/assignment/:id" element={<CreateAssignment />} />
    </Routes>
  );
};

export default Teacher;
