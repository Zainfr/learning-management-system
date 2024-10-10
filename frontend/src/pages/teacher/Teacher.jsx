import { Routes, Route, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import TeacherDashboard from "./TeacherDashboard";
import CreateAssignment from "./CreateAssignment";
import ViewAssignments from "./ViewAssignments";
import AllSubmissions from "./AllSubmissions";
import ViewDocument from "../../components/ViewDocument";
import ViewExp from "./ViewExp";
import AllExp from "./AllExp";

const Teacher = () => {
  return (
    <Routes>
      <Route path="/" element={<TeacherDashboard />} />
      <Route path="assignments" element={<ViewAssignments />} />
      <Route
        path="assignment/:assignmentId/submissions"
        element={<AllSubmissions />}
      />
      <Route path="experiment/:rollno" element={<AllExp />} />
      <Route path="experiments" element={<ViewExp />} />
      <Route path="assignment" element={<CreateAssignment />} />
    </Routes>
  );
};

export default Teacher;
