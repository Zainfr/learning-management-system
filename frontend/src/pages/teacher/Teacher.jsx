import { Routes, Route, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import TeacherDashboard from "./TeacherDashboard";
import CreateAssignment from "./CreateAssignment";
import ViewAssignments from "./ViewAssignments";
import AllSubmissions from "./AllSubmissions";
import ViewDocument from "../../components/ViewDocument";

const Teacher = () => {
  return (
    <Routes>
      <Route path="/" element={<TeacherDashboard />} />
      <Route path="assignments" element={<ViewAssignments />} />
      <Route
        path="assignment/:assignmentId/submissions"
        element={<AllSubmissions />}
      />
      <Route path="assignment" element={<CreateAssignment />} />
    </Routes>
  );
};

export default Teacher;
