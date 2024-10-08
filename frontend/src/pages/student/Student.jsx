import { Routes, Route } from "react-router-dom";
import StudentDashboard from "./StudentDashboard";
import StudentExperiment from "./StudentExperiment";
import UploadAssignment from "./UploadAssignment";
import UploadExperiment from "./UploadExperiment";
import ViewExperiments from "./ViewExperiment";

const Student = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentDashboard />} />
      <Route path="assignments" element={<StudentExperiment />} />
      <Route
        path="assignment/:assignmentId/upload"
        element={<UploadAssignment />}
      />
      <Route path="/upload/:rollno" element={<UploadExperiment />} />
      <Route path="/experiments/:rollno" element={<ViewExperiments/>}/>
    </Routes>
  );
};

export default Student;
