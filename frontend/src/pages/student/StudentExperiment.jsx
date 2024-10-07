import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";

const StudentExperiment = () => {
  const [student, setStudent] = useState({});
  const [assignments, setAssignments] = useState([]);
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

    fetchAssignments(); // Call the fetch function when component mounts
  }, []);

  return (
    <div>
      <Header user="Student" />

      <div className="bg-gray-200 h-[900px]">
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
