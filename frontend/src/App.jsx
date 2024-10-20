import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/admin/Admin";
import Student from "./pages/student/Student";
import Teacher from "./pages/teacher/Teacher";
import Login from "./components/Login";
import Unauthorized from "./pages/Unauthorized";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path ="/reset-password"element ={<ResetPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route
        path="/admin/:id/*"
        element={
          <PrivateRoute allowedRoles={['Admin']}>
            <Admin />
          </PrivateRoute>
        }
      />
      <Route
        path="/teacher/:id/*"
        element={
          <PrivateRoute allowedRoles={['Teacher']}>
            <Teacher />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/:id/*"
        element={
          <PrivateRoute allowedRoles={['Student']}>
            <Student />
          </PrivateRoute>
        }
      />
      {/* Catch-all route for any unmatched paths */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;