import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { UserCircle, BookOpen, NotebookPen, LibraryBig } from "lucide-react";

const StudentSidebar = ({ userName, rollNo }) => {
  const location = useLocation();
  const { id } = useParams();
  const isActive = (path) => location.pathname === path;
  return (
    <div className="fixed top-16 left-0 h-full w-64 bg-gradient-to-b from-blue-800 to-blue-500 text-white flex flex-col backdrop-blur-lg">
      <div className="p-6 text-2xl font-light border-b border-white/30">
        {userName}'s Dashboard
      </div>
      <nav className="mt-6 flex flex-col space-y-2 px-4">
        <ul className="space-y-3">
          <li>
            <Link
              to={`/student/${id}`}
              className={`flex items-center text-lg p-3 rounded-xl transition-all duration-300 ease-in-out ${
                isActive(`/student/${id}`)
                  ? "bg-gradient-to-r from-white to-blue-50 text-blue-900 shadow-lg shadow-blue-500/20 font-medium scale-105 -translate-y-0.5"
                  : "text-gray-100 hover:bg-white/10 hover:shadow-md hover:scale-102 hover:-translate-y-0.5"
              }`}
            >
              <UserCircle
                size={20}
                className={`transition-colors duration-300 ${
                  isActive(`/student/${id}`) ? "text-blue-600" : ""
                }`}
              />
              <span className="pl-4 font-medium">Profile</span>
            </Link>
          </li>
          <li>
            <Link
              to={`/student/${id}/assignments`}
              className={`flex items-center text-lg p-3 rounded-xl transition-all duration-300 ease-in-out ${
                isActive(`/student/${id}/assignments`)
                  ? "bg-gradient-to-r from-white to-blue-50 text-blue-900 shadow-lg shadow-blue-500/20 font-medium scale-105 -translate-y-0.5"
                  : "text-gray-100 hover:bg-white/10 hover:shadow-md hover:scale-102 hover:-translate-y-0.5"
              }`}
            >
              <BookOpen
                size={20}
                className={`transition-colors duration-300 ${
                  isActive(`/student/${id}/assignments`) ? "text-blue-600" : ""
                }`}
              />
              <span className="pl-4 font-medium">View Assignments</span>
            </Link>
          </li>
          <li>
            <Link
              to={`/student/${id}/upload/${rollNo}`}
              className={`flex items-center text-lg p-3 rounded-xl transition-all duration-300 ease-in-out ${
                isActive(`/student/${id}/upload/${rollNo}`)
                  ? "bg-gradient-to-r from-white to-blue-50 text-blue-900 shadow-lg shadow-blue-500/20 font-medium scale-105 -translate-y-0.5"
                  : "text-gray-100 hover:bg-white/10 hover:shadow-md hover:scale-102 hover:-translate-y-0.5"
              }`}
            >
              <NotebookPen
                size={20}
                className={`transition-colors duration-300 ${
                  isActive(`/student/${id}/upload/${rollNo}`)
                    ? "text-blue-600"
                    : ""
                }`}
              />
              <span className="pl-4 font-medium">Upload Experiments</span>
            </Link>
          </li>
          <li>
            <Link
              to={`/student/${id}/experiments/${rollNo}`}
              className={`flex items-center text-lg p-3 rounded-xl transition-all duration-300 ease-in-out ${
                isActive(`/student/${id}/experiments/${rollNo}`)
                  ? "bg-gradient-to-r from-white to-blue-50 text-blue-900 shadow-lg shadow-blue-500/20 font-medium scale-105 -translate-y-0.5"
                  : "text-gray-100 hover:bg-white/10 hover:shadow-md hover:scale-102 hover:-translate-y-0.5"
              }`}
            >
              <LibraryBig
                size={20}
                className={`transition-colors duration-300 ${
                  isActive(`/student/${id}/experiments/${rollNo}`)
                    ? "text-blue-600"
                    : ""
                }`}
              />
              <span className="pl-4 font-medium">Experiments</span>
            </Link>
          </li>
          <li>
            <Link
              to={`/student/${id}/studyMaterials`}
              className={`flex items-center text-lg p-3 rounded-xl transition-all duration-300 ease-in-out ${
                isActive(`/student/${id}/studyMaterials`)
                  ? "bg-gradient-to-r from-white to-blue-50 text-blue-900 shadow-lg shadow-blue-500/20 font-medium scale-105 -translate-y-0.5"
                  : "text-gray-100 hover:bg-white/10 hover:shadow-md hover:scale-102 hover:-translate-y-0.5"
              }`}
            >
              <LibraryBig
                size={20}
                className={`transition-colors duration-300 ${
                  isActive(`/student/${id}/studyMaterails`)
                    ? "text-blue-600"
                    : ""
                }`}
              />
              <span className="pl-4 font-medium">Study Materials</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default StudentSidebar;
