import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import StudentSidebar from "../../components/StudentSidebar";

const StudentExperiment = () => {
  const [student, setStudent] = useState({});
  const [assignments, setAssignments] = useState([]);
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();


  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch("http://localhost:3001/assignments"); // Adjust the API URL if needed
        if (!response.ok) {
          throw new Error("Failed to fetch assignments");
        }
        const data = await response.json();
        setAssignments(data); // Update the assignments state
      } catch (error) {
        console.error("Error fetching assignments:", error);
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
      console.log(student)
    };

    fetchStudent();

    fetchAssignments(); // Call the fetch function when component mounts
  }, []);

  return (
<div className="h-screen flex flex-col">
  <div className="sticky top-0 left-0 right-0 z-20">
    <Header user="Student" />
  </div>

  <div className="flex flex-1 h-[calc(100vh-60px)] w-full overflow-hidden">
    <div className={`h-full bg-blue-800 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"}`}>
      <StudentSidebar userName={student?.name} rollNo={student?.rollno}/>
    </div>
    <div className="flex-1 p-10 overflow-auto">
      <table className="w-full h-fit bg-white rounded-lg shadow-lg border border-gray-300">
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
        <tbody className="overflow-auto">
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
                        `/student/${id}/assignment/${assignment._id}/upload`
                      )
                    }
                  >
                    Upload
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

  );
};

export default StudentExperiment;
