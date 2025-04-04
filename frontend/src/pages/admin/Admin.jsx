import { Routes, Route } from "react-router-dom";
import CreateStudent from "./CreateStudent";
import CreateTeacher from "./CreateTeacher";
import CreateCourse from "./CreateCourse";
import AdminDashboard from "./AdminDashboard";
import CreateTimeTable from "./CreateTimeTable";

const Admin = () => {
  return (
    <Routes>
      {/* This will match "/admin/:id" and show the AdminDashboard */}
      <Route path="/" element={<AdminDashboard />} />

      {/* These will match "/admin/:id/createStudent", "/admin/:id/createTeacher", and "/admin/:id/createCourse" */}
      <Route path="createStudent" element={<CreateStudent />} />
      <Route path="createTeacher" element={<CreateTeacher />} />
      <Route path="createCourse" element={<CreateCourse />} />
      <Route path="createTimeTable" element={<CreateTimeTable />} />
    </Routes>
  );
};

export default Admin;
