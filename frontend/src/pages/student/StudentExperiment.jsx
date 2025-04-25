import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import StudentSidebar from "../../components/StudentSidebar";
import { Calendar, Clock, FileText, Upload, AlertCircle, CheckCircle, Book } from "lucide-react";

const StudentExperiment = () => {
  const [student, setStudent] = useState({});
  const [assignments, setAssignments] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3001/assignments");
        if (!response.ok) {
          throw new Error("Failed to fetch assignments");
        }
        const data = await response.json();
        setAssignments(data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setIsLoading(false);
      }
    };

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
    };

    fetchStudent();
    fetchAssignments();
  }, [id]);

  // Function to determine assignment status
  const getAssignmentStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: "overdue", color: "text-red-500", bgColor: "bg-red-50", icon: <AlertCircle size={16} className="text-red-500" /> };
    } else if (diffDays <= 2) {
      return { status: "due soon", color: "text-amber-500", bgColor: "bg-amber-50", icon: <Clock size={16} className="text-amber-500" /> };
    } else {
      return { status: "upcoming", color: "text-green-500", bgColor: "bg-green-50", icon: <CheckCircle size={16} className="text-green-500" /> };
    }
  };

  // Function to format time remaining
  const formatTimeRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
      return "Due today";
    } else if (diffDays === 1) {
      return "Due tomorrow";
    } else {
      return `${diffDays} days remaining`;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="sticky top-0 left-0 right-0 z-20">
        <Header user="Student" />
      </div>

      <div className="flex flex-1 h-[calc(100vh-60px)] w-full overflow-hidden">
        <div className={`h-full bg-blue-800 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"}`}>
          <StudentSidebar userName={student?.name} rollNo={student?.rollno} />
        </div>

        <div className="flex-1 bg-gray-50 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
                <p className="text-gray-600 mt-1">View and submit your course assignments</p>
              </div>

              <div className="mt-4 md:mt-0 flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                <Book className="text-blue-600" size={18} />
                <span className="text-blue-800 font-medium">
                  {assignments.length} Assignment{assignments.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : assignments && assignments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map((assignment) => {
                  const { status, color, bgColor, icon } = getAssignmentStatus(assignment.dueDate);
                  return (
                    <div
                      key={assignment._id}
                      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FileText className="text-blue-600" size={18} />
                            </div>
                            <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">{assignment.title}</h3>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${color}`}>
                            {status}
                          </span>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center text-gray-600 text-sm">
                            <Calendar size={16} className="mr-2" />
                            <span>Due: {new Date(assignment.dueDate).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}</span>
                          </div>

                          <div className="flex items-center text-sm">
                            {icon}
                            <span className={`ml-2 ${color}`}>
                              {formatTimeRemaining(assignment.dueDate)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-6">
                          <button
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105"
                            onClick={() => navigate(`/student/${id}/assignment/${assignment._id}/upload`)}
                          >
                            <Upload size={16} />
                            <span>Upload Submission</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-blue-50 rounded-full mb-4">
                  <FileText className="text-blue-500" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Assignments Found</h3>
                <p className="text-gray-500 max-w-md">
                  There are currently no assignments for your courses. New assignments will appear here when they are available.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentExperiment;