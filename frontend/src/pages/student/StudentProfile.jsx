import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const StudentProfile = ({ onLogout, user }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [teacher, setTeacher] = useState({});
  const [student, setStudent] = useState({});
  const [error, setError] = useState("");
  const { id } = useParams();
  const handleLogoutClick = () => {
    setIsVisible(true);
  };

  useEffect(() => {
    if (user === "Teacher") {
      const fetchTeacher = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/api/teacher/${id}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setTeacher(data);
        } catch (error) {
          console.error("Error fetching Teachers:", error);
          setError("Failed to fetch Teachers. Please try again later.");
        }
      };

      fetchTeacher();
    } else if (user === "Student") {
      const fetchStudent = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/api/student/${id}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setStudent(data);
        } catch (error) {
          console.error("Error fetching Student:", error);
          setError("Failed to fetch Student. Please try again later.");
        }
      };

      fetchStudent();
    }
  }, []);

  const handleConfirmLogout = () => {
    onLogout(); // Call the logout function passed as a prop
    setIsVisible(false);
  };

  const handleCancelLogout = () => {
    setIsVisible(false);
  };
  return (
    <div className="absolute max-w-sm mx-auto bg-white shadow-lg overflow-hidden rounded-2xl p-3">
      <div className="flex flex-col items-center p-6">
        <img
          src="https://via.placeholder.com/100"
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4"
        />
        <h1 className="text-xl font-semibold text-gray-600">
          {teacher.teacher?.teacher_name || student.student?.name}
        </h1>
        <p className="text-gray-600">
          {teacher.teacher?.email || student.student?.email}
        </p>
      </div>

      <div className="hover:bg-slate-300 rounded-2xl p-2">
        <button onClick={handleLogoutClick}>Log out</button>
        {isVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
              <p>Are you sure you want to log out?</p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleCancelLogout}
                  className="mr-2 bg-gray-300 rounded-lg py-1 px-4"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="bg-red-500 text-white rounded-lg py-1 px-4"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
