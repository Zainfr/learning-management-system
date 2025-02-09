import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  FaUser,
  FaBook,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaFileUpload,
} from "react-icons/fa";

const TeacherSidebar = ({ userName, rollNo }) => {
  const location = useLocation();
  const { id } = useParams();
  const isActive = (path) => location.pathname === path;
  return (
    <div>
      <div className="fixed top-16 left-0 h-full w-64 bg-gradient-to-b from-blue-800 to-blue-500 text-white flex flex-col backdrop-blur-lg">
        <div className="p-6 text-2xl font-light border-b border-white/30">
          {userName}'s Dashboard
        </div>
        <nav className="mt-6 flex flex-col space-y-2 px-4">
          <ul className="space-y-3">
            <li>
              <Link
                to={`/teacher/${id}`}
                className={`flex items-center text-lg p-3 rounded-xl transition-all duration-300 ease-in-out ${
                  isActive(`/teacher/${id}`)
                    ? "bg-gradient-to-r from-white to-blue-50 text-blue-900 shadow-lg shadow-blue-500/20 font-medium scale-105 -translate-y-0.5"
                    : "text-gray-100 hover:bg-white/10 hover:shadow-md hover:scale-102 hover:-translate-y-0.5"
                }`}
              >
                <FaUser
                  size={20}
                  className={`transition-colors duration-300 ${
                    isActive(`/teacher/${id}`) ? "text-blue-600" : ""
                  }`}
                />
                <span className="pl-4 font-medium">Profile</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/teacher/${id}/assignment`}
                className={`flex items-center text-lg p-3 rounded-xl transition-all duration-300 ease-in-out ${
                  isActive(`/teacher/${id}/assignment`)
                    ? "bg-gradient-to-r from-white to-blue-50 text-blue-900 shadow-lg shadow-blue-500/20 font-medium scale-105 -translate-y-0.5"
                    : "text-gray-100 hover:bg-white/10 hover:shadow-md hover:scale-102 hover:-translate-y-0.5"
                }`}
              >
                <FaBook
                  size={20}
                  className={`transition-colors duration-300 ${
                    isActive(`/teacher/${id}/assignment`) ? "text-blue-600" : ""
                  }`}
                />
                <span className="pl-4 font-medium">Create Assignment</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/teacher/${id}/assignments`}
                className={`flex items-center text-lg p-3 rounded-xl transition-all duration-300 ease-in-out ${
                  isActive(`/teacher/${id}/assignments`)
                    ? "bg-gradient-to-r from-white to-blue-50 text-blue-900 shadow-lg shadow-blue-500/20 font-medium scale-105 -translate-y-0.5"
                    : "text-gray-100 hover:bg-white/10 hover:shadow-md hover:scale-102 hover:-translate-y-0.5"
                }`}
              >
                <FaUserGraduate
                  size={20}
                  className={`transition-colors duration-300 ${
                    isActive(`/teacher/${id}/assignments`)
                      ? "text-blue-600"
                      : ""
                  }`}
                />
                <span className="pl-4 font-medium">Submissions</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/teacher/${id}/experiments`}
                className={`flex items-center text-lg p-3 rounded-xl transition-all duration-300 ease-in-out ${
                  isActive(`/teacher/${id}/experiments`)
                    ? "bg-gradient-to-r from-white to-blue-50 text-blue-900 shadow-lg shadow-blue-500/20 font-medium scale-105 -translate-y-0.5"
                    : "text-gray-100 hover:bg-white/10 hover:shadow-md hover:scale-102 hover:-translate-y-0.5"
                }`}
              >
                <FaChalkboardTeacher
                  size={20}
                  className={`transition-colors duration-300 ${
                    isActive(`/teacher/${id}/experiments`)
                      ? "text-blue-600"
                      : ""
                  }`}
                />
                <span className="pl-4 font-medium">Experiments</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/teacher/${id}/upload/studyMaterial`}
                className={`flex items-center text-lg p-3 rounded-xl transition-all duration-300 ease-in-out ${
                  isActive(`/teacher/${id}/upload/studyMaterial`)
                    ? "bg-gradient-to-r from-white to-blue-50 text-blue-900 shadow-lg shadow-blue-500/20 font-medium scale-105 -translate-y-0.5"
                    : "text-gray-100 hover:bg-white/10 hover:shadow-md hover:scale-102 hover:-translate-y-0.5"
                }`}
              >
                <FaFileUpload
                  size={20}
                  className={`transition-colors duration-300 ${
                    isActive(`/teacher/${id}/upload/studyMaterial`)
                      ? "text-blue-600"
                      : ""
                  }`}
                />
                <span className="pl-4 font-medium">Upload Material</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default TeacherSidebar;
