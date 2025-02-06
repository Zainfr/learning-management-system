import React from "react";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StudentSidebar from "../../components/StudentSidebar";

const StudentDashboard = () => {
  const [student, setStudent] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

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
        const response = await fetch(`http://localhost:3001/api/student/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setStudent(data?.student);
      } catch (error) {
        console.error("Error fetching Student:", error);
      }
      console.log(student)
    };

    fetchStudent();
  }, []);

  const handleClick1 = () => {
    navigate(`/student/${id}/assignments`);
  };

  const handleClick2 = () => {
    navigate(`/student/${id}/upload/${rollNo}`);
  };

  const handleClick3 = () => {
    navigate(`/student/${id}/experiments/${rollNo}`);
  };

  return (
    <div className="h-screen flex flex-col">
    <div className="sticky top-0 left-0 right-0 z-20">
      <Header user="Student" />
    </div>

    <div className="flex flex-1 h-[calc(100vh-60px)] w-full overflow-hidden">
      {/* Sidebar - Collapsible on Mobile */}
      <div className={`h-full bg-blue-800 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"}`}>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="text-white p-2 block md:hidden"
        >
          {isSidebarOpen ? "❌" : "☰"}
        </button>
        <StudentSidebar userName={student?.name} rollNo={student?.rollno}/>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 flex justify-center items-center p-6">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
    
    {/* Profile Section */}
    <div className="md:col-span-2 bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center space-y-6">
      <img 
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR18Ios0zLfBTJ-FnoCg8pfFjjKtNLuw4bVqg&s" 
        alt="Profile Image" 
        className="rounded-full border-4 border-blue-500 shadow-md"
      />
      <div className="space-y-2">
      <h1 className="text-3xl py-2 font-black text-gray-800">{student?.name}</h1>
      <p className="text-gray-600 text-lg">
        <span className="font-semibold">Roll No:</span> {student?.rollno}
      </p>
      <p className="text-gray-600 text-lg">
        <span className="font-semibold">Created At:</span> {student?.updatedAt}
      </p>
      </div>

      {/* Logout Button */}
      <button 
        onClick={handleLogoutClick} 
        className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-16 rounded-full shadow-md transition duration-300"
      >
        Log out
      </button>

      {/* Logout Confirmation Modal */}
      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="text-gray-700">Are you sure you want to log out?</p>
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
    </div>

    {/* Details & Subjects Section */}
    <div className="space-y-6">
      
      {/* Contact Details */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Details</h3>
        <p className="text-gray-600">
          <span className="font-semibold">Email:</span> {student?.email}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Phone:</span> {student?.mobile}
        </p>
      </div>

      {/* Subjects */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Subjects</h3>
        <div className="space-y-3">
          {student?.experiments?.map((experiment, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center bg-blue-100 border border-blue-300 rounded-lg px-4 py-3 shadow-sm"
            >
              <p className="text-gray-800 font-medium">{experiment.subject_name}</p>
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

export default StudentDashboard;
