import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import TeacherSidebar from "../../components/TeacherSidebar";

const ViewAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [teacher, setTeacher] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch("http://localhost:3001/assignments");
        if (!response.ok) {
          throw new Error("Failed to fetch assignments");
        }
        const data = await response.json();
        setAssignments(data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchAssignments();
    const fetchTeacher = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/teacher/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTeacher(data.teacher);
        console.log(teacher);
      } catch (error) {
        console.error("Error fetching Teachers:", error);
        setError("Failed to fetch Teachers. Please try again later.");
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
        {/* Sidebar - Collapsible on Mobile */}
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

        <div className="flex-1 bg-gray-200 p-10 overflow-auto">
          <div className="p-10">
            <table className="min-w-full bg-white rounded-md shadow-lg border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b border-gray-300 text-left">
                    Assignment
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 text-left">
                    Due Date
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {assignments && assignments.length > 0 ? (
                  assignments.map((assignment) => (
                    <tr key={assignment._id}>
                      <td className="py-2 px-4 border-b border-gray-300">
                        {assignment.title}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-300">
                        {new Date(assignment.dueDate).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-300">
                        <button
                          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105"
                          onClick={() =>
                            navigate(
                              `/teacher/${id}/assignment/${assignment._id}/submissions`
                            )
                          }
                        >
                          View Submissions
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-4">
                      No Assignment found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAssignments;
