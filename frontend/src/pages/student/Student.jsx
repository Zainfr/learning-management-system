import { Routes, Route } from "react-router-dom";
import StudentDashboard from "./StudentDashboard";
import StudentExperiment from "./StudentExperiment";
import UploadAssignment from "./UploadAssignment";

const Student = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentDashboard />} />
      <Route path="assignments" element={<StudentExperiment />} />
      <Route
        path="assignment/:assignmentId/upload"
        element={<UploadAssignment />}
      />
    </Routes>
  );
};

export default Student;
