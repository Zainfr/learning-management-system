import React, { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import logo from "../assets/aiktc-logo.png"; // Update the path to your logo
import { FaBars } from "react-icons/fa";
import { UserCircle, BookOpen, Users, GraduationCap, Table2 } from "lucide-react";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to control sidebar visibility on mobile
  const location = useLocation(); // Get the current location (path)
  const { id } = useParams();
  // Fix: Update isActive to check against full path including id
  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === `/admin/${id}`;
    }
    return location.pathname === path;
  };

  return (
    <div className="h-screen">
      {/* Mobile Menu Button */}
      <div className="md:hidden flex justify-between items-center p-4 pb-[28px] -mt-[80px] text-black">
        <button onClick={() => setIsOpen(!isOpen)} className="mt-24">
          <FaBars size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed h-full bg-gradient-to-b from-blue-800 to-blue-600 text-gray-400 border-r border-blue-700/30 shadow-xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:relative`}
      >
        <div className="flex pt-3 justify-center border-b border-white/30 backdrop-blur-sm">
          <img src={logo} alt="Logo" width={"48px"} className="mb-4 md:mb-7" />
          <div>
            <h2 className="text-xl text-white px-4 pt-2">Admin Panel</h2>
            <h2 className="text-[12px] text-gray-300 px-4">maviya@admin.com</h2>
          </div>
        </div>
        <div className="p-6">
          <nav>
            <ul>
              <li className="mb-4">
                <Link
                  to={`/admin/${id}`}
                  className={`flex items-center text-lg p-3 rounded-lg transition-all duration-300 ease-in-out ${isActive("/admin")
                    ? "bg-gradient-to-r from-white via-blue-100 to-white text-blue-900 shadow-lg shadow-blue-500/30 font-medium scale-105 -translate-y-0.5 border-l-4 border-white"
                    : "text-gray-100 hover:bg-white/10 hover:shadow-md hover:scale-102 hover:-translate-y-0.5"
                    }`}
                >
                  <UserCircle
                    size={24}
                    className={`transition-colors duration-300 ${isActive("/admin") ? "text-blue-600" : ""
                      }`}
                  />
                  <p className="pl-4">Dashboard</p>
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to={`/admin/${id}/createCourse`}
                  className={`flex items-center text-lg p-3 rounded-lg transition-all duration-300 ease-in-out ${isActive(`/admin/${id}/createCourse`)
                    ? "bg-gradient-to-r from-white to-blue-50 text-blue-900 shadow-lg shadow-blue-500/20 font-medium scale-105 -translate-y-0.5"
                    : "text-gray-100 hover:bg-white/10 hover:shadow-md hover:scale-102 hover:-translate-y-0.5"
                    }`}
                >
                  <BookOpen
                    size={24}
                    className={`transition-colors duration-300 ${isActive(`/admin/${id}/createCourse`)
                      ? "text-blue-600"
                      : ""
                      }`}
                  />
                  <p className="pl-4">Create Course</p>
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to={`/admin/${id}/createStudent`}
                  className={`flex items-center text-lg p-3 rounded-lg transition-all duration-300 ease-in-out ${isActive(`/admin/${id}/createStudent`)
                    ? "bg-gradient-to-r from-white to-blue-50 text-blue-900 shadow-lg shadow-blue-500/20 font-medium scale-105 -translate-y-0.5"
                    : "text-gray-100 hover:bg-white/10 hover:shadow-md hover:scale-102 hover:-translate-y-0.5"
                    }`}
                >
                  <Users
                    size={24}
                    className={`transition-colors duration-300 ${isActive(`/admin/${id}/createStudent`)
                      ? "text-blue-600"
                      : ""
                      }`}
                  />

                  <p className="pl-4">Create Student</p>
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to={`/admin/${id}/createTeacher`}
                  className={`flex items-center text-lg p-3 rounded-lg transition-all duration-300 ease-in-out ${isActive(`/admin/${id}/createTeacher`)
                    ? "bg-gradient-to-r from-white to-blue-50 text-blue-900 shadow-lg shadow-blue-500/20 font-medium scale-105 -translate-y-0.5"
                    : "text-gray-100 hover:bg-white/10 hover:shadow-md hover:scale-102 hover:-translate-y-0.5"
                    }`}
                >
                  <GraduationCap
                    size={24}
                    className={`transition-colors duration-300 ${isActive(`/admin/${id}/createTeacher`)
                      ? "text-blue-600"
                      : ""
                      }`}
                  />

                  <p className="pl-4">Create Teacher</p>
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to={`/admin/${id}/createTimeTable`}
                  className={`flex items-center text-lg p-3 rounded-lg transition-all duration-300 ease-in-out ${isActive(`/admin/${id}/createTimeTable`)
                    ? "bg-gradient-to-r from-white to-blue-50 text-blue-900 shadow-lg shadow-blue-500/20 font-medium scale-105 -translate-y-0.5"
                    : "text-gray-100 hover:bg-white/10 hover:shadow-md hover:scale-102 hover:-translate-y-0.5"
                    }`}
                >
                  <Table2
                    size={24}
                    className={`transition-colors duration-300 ${isActive(`/admin/${id}/createTimeTable`)
                      ? "text-blue-600"
                      : ""
                      }`}
                  />

                  <p className="pl-4">Create TimeTable</p>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
