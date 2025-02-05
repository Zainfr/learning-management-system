import React, { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import logo from "../assets/aiktc-logo.png"; // Update the path to your logo
import { FaBars } from "react-icons/fa";
import { FaHome, FaBook, FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to control sidebar visibility on mobile
  const location = useLocation(); // Get the current location (path)
  const { id } = useParams();
  // Determine if a link is active based on the current path
  const isActive = (path) => location.pathname === path;

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
        className={`fixed h-full bg-[#0066b2] text-gray-400 border-solid border-r-2 border-gray-400 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:relative`}
      >
        <div className="flex pt-3 justify-center border-b-2 border-gray-400">
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
                  className={`flex text-lg p-2 rounded no-underline ${isActive("/admin")
                    ? "bg-white  text-gray-900  border-2 border-white"
                    : "text-gray-100 hover:bg-[#002D62]"
                    }`}
                >
                  <FaHome size={24} className="" />

                  <p className="pl-4">Dashboard</p>
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to={`/admin/${id}/createCourse`}
                  className={`text-lg p-2 flex rounded no-underline ${isActive("/admin/createCourse")
                    ? "bg-white text-gray-900  border-2 border-white"
                    : "text-gray-100 hover:bg-[#002D62]"
                    }`}
                >
                  <FaBook size={24} className="p-[2px]" />

                  <p className="pl-4">Create Course</p>
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to={`/admin/${id}/createStudent`}
                  className={`text-lg p-2 flex rounded no-underline ${isActive("/admin/createStudent")
                    ? "bg-white text-gray-900  border-2 border-white"
                    : "text-gray-100 hover:bg-[#002D62]"
                    }`}
                >
                  <FaUserGraduate size={24} className="p-[2px]" />

                  <p className="pl-4">Create Student</p>
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to={`/admin/${id}/createTeacher`}
                  className={`text-lg p-2 flex rounded no-underline ${isActive("/admin/createTeacher")
                    ? "bg-white text-gray-900  border-2 border-white"
                    : "text-gray-100 hover:bg-[#002D62]"
                    }`}
                >
                  <FaChalkboardTeacher size={24} className="" />

                  <p className="pl-4">Create Teacher</p>
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
