import React from "react";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "../../components/TeacherSidebar";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBook,
  FaCalendarAlt,
} from "react-icons/fa";

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState({});
  const [student, setStudent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from local storage
    navigate("/"); // Redirect to the login page
  };
  const handleConfirmLogout = () => {
    handleLogout();
    setIsVisible(false);
  };

  const handleCancelLogout = () => {
    setIsVisible(false);
  };
  const handleLogoutClick = () => {
    setIsVisible(true);
  };
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/students`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setStudent(data?.count);
      } catch (error) {
        console.error("Error fetching Student:", error);
      }
      console.log(student);
    };

    fetchStudent();

    const fetchTeacher = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/teacher/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTeacher(data.teacher);
      } catch (error) {
        console.error("Error fetching Teachers:", error);
      }
    };

    fetchTeacher();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="sticky top-0 left-0 right-0 z-20">
        <Header user="Teacher" />
      </div>
      <div className="flex flex-1 h-[calc(100vh-60px)] w-full overflow-hidden">
        <div
          className={`h-full bg-blue-800 transition-all duration-300 ${
            isSidebarOpen ? "w-64" : "w-16"
          }`}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white p-2 block md:hidden"
          >
            {isSidebarOpen ? "❌" : "☰"}
          </button>
          <TeacherSidebar
            userName={teacher?.teacher_name}
            rollNo={teacher?.email}
          />
        </div>

        {/* Main Dashboard Content */}
        <div className="flex-1 bg-gradient-to-br from-gray-200 via-white to-gray-200 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start space-x-6">
                  <img
                    src="https://images.unsplash.com/photo-1543466835-00a7907e9de1"
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {teacher?.teacher_name || "Loading..."}
                    </h2>
                    <p className="text-blue-600">{teacher?.email}</p>
                    <div className="mt-4 flex items-center space-x-4 pb-6">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        Faculty Member
                      </span>
                    </div>
                    <button
                      onClick={handleLogoutClick}
                      className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-16 rounded-full shadow-md transition duration-300"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              </div>
              {isVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white rounded-lg p-6 shadow-lg w-80">
                    <h2 className="text-lg font-semibold mb-4">
                      Confirm Logout
                    </h2>
                    <p className="text-gray-700">
                      Are you sure you want to log out?
                    </p>
                    <div className="mt-4 flex justify-end space-x-4">
                      <button
                        onClick={handleCancelLogout}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg py-1 px-4 transition duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmLogout}
                        className="bg-red-500 hover:bg-red-700 text-white font-medium rounded-lg py-1 px-4 transition duration-300"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Quick Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Classes</span>
                    <span className="text-2xl font-bold">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Students</span>
                    <span className="text-2xl font-bold">{student}</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-sm">
                    <FaBook className="text-blue-500" />
                    <span>New assignment created</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <FaCalendarAlt className="text-blue-500" />
                    <span>Class schedule updated</span>
                  </div>
                </div>
              </div>

              {/* Subjects Card */}
              <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Your Subjects
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {teacher.subjects?.map((subject, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl">
                      <p className="font-medium text-gray-700">
                        {subject.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
