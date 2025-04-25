import React from "react";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StudentSidebar from "../../components/StudentSidebar";
import { BookOpen, GraduationCap, BookCheck, Users } from "lucide-react";
import AttendanceStats from "../../components/AttendanceStats"; // Import the new component

const StudentDashboard = () => {
  const profileImageURLS = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR18Ios0zLfBTJ-FnoCg8pfFjjKtNLuw4bVqg&s",
    "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNhdHxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZnVubnklMjBjYXR8ZW58MHx8MHx8fDA%3D",
    "https://media.istockphoto.com/id/916176576/photo/big-eyed-naughty-obese-cat-showing-paws-on-wooden-table.jpg?s=1024x1024&w=is&k=20&c=2N0xhn4lTDjxm5eHpkFnVaiLIAs2dC5c3LGnLpW7tK4=",
    "https://images.unsplash.com/photo-1518288774672-b94e808873ff?q=80&w=1938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  const [student, setStudent] = useState({});
  const [experiment, setExperiment] = useState([]);
  const [stats, setStats] = useState({});
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

  const fetchExperiments = async (rollno) => {
    try {
      const response = await fetch(`http://localhost:3001/api/drive/experiments/${rollno}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setExperiment(data.experiments);
      console.log("Fetched experiments data:", data.experiments); // Debug log
    } catch (error) {
      console.error("Error fetching Experiments:", error);
      setError("Error fetching Experiments");
    }
  }
  const fetchAttendanceStatistics = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/lms/student-attendance/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setStats(data.data);
      console.log("Fetched attendance data:", data.data); // Debug log
    } catch (error) {
      console.error("Error fetching Attendance:", error);
      setError("Error fetching Attendance");
    }
  }

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
      console.log(student);
    };

    fetchStudent();
    fetchAttendanceStatistics();
  }, []);

  useEffect(() => {
    if (student?.rollno) {
      fetchExperiments(student.rollno);
    }
  }, [student?.rollno]);


  return (
    <div className="h-screen flex flex-col">
      <div className="sticky top-0 left-0 right-0 z-20">
        <Header user="Student" />
      </div>

      <div className="flex flex-1 h-[calc(100vh-60px)] w-full overflow-hidden">
        <div
          className={`h-full bg-blue-800 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"
            }`}
        >
          <StudentSidebar userName={student?.name} rollNo={student?.rollno} />
        </div>

        <div className="flex-1 bg-gray-50 p-8 overflow-auto">
          <div className="max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Profile Card - Spans 2 columns */}
              <div className="md:col-span-2 bg-white h-fit rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col items-center space-y-6 mt-8">
                  <div className="relative">
                    <img
                      src={profileImageURLS[Math.floor(Math.random() * 8)]}
                      alt="Profile"
                      className="w-32 aspect-square rounded-full object-cover border-4 border-blue-100 shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-green-400 w-6 h-6 rounded-full border-4 border-white"></div>
                  </div>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {student?.name}
                    </h2>
                    <p className="text-blue-600 font-medium">
                      {student?.rollno}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <span className="px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                      Computer Engineering
                    </span>
                    <span className="px-4 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                      Active
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

              {/* Quick Stats Cards
              <div className="md:col-span-1 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <BookOpen className="text-2xl" />
                  <h3 className="text-lg font-semibold">Subjects</h3>
                </div>
                <p className="text-3xl font-bold">
                  {experiment?.length || 0}
                </p>
                <p className="text-blue-100 mt-2">Enrolled Courses</p>
              </div>

              <div className="md:col-span-1 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <GraduationCap className="text-2xl" />
                  <h3 className="text-lg font-semibold">Semester</h3>
                </div>
                <p className="text-3xl font-bold">5</p>
                <p className="text-purple-100 mt-2">Current Progress</p>
              </div> */}

              {/* Attendance Stats Component */}
              <AttendanceStats stats={stats} email={student?.email} phone={student?.mobile} />

              {/* Subjects List */}
              <div className="md:col-span-2 h-fit bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Enrolled Subjects
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {experiment?.map((experiment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <BookCheck className="text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-700">
                          {experiment.subject_name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">In Progress</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Details Card */}

            </div>
          </div>
        </div>
      </div>
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
  );
};

export default StudentDashboard;