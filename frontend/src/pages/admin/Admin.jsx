import { Routes, Route } from "react-router-dom";
import CreateStudent from "./CreateStudent";
import CreateTeacher from "./CreateTeacher";
import CreateCourse from "./CreateCourse";
import AdminDashboard from "./AdminDashboard";

const Admin = () => {
  return (
    <Routes>
      <Route path="/:id" element={<AdminDashboard />} />
      <Route path="/createStudent/:id" element={<CreateStudent />} />
      <Route path="/createTeacher/:id" element={<CreateTeacher />} />
      <Route path="/createCourse/:id" element={<CreateCourse />} />
    </Routes>
  );
};

export default Admin;
