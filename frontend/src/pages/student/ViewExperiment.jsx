import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import StudentSidebar from "../../components/StudentSidebar";

const ViewExperiments = () => {
    const [experiments, setExperiments] = useState([]);
    const [student, setStudent] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [error, setError] = useState(null);
    const { rollno } = useParams();
    const { id } = useParams();

    useEffect(() => {
        const fetchStudent = async () => {
            try {
              const response = await fetch(`http://localhost:3001/api/student/${id}`);
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              const data = await response.json();
              setStudent(data.student);
              console.log("Fetched student data:", data.student); // Debug log
            } catch (error) {
              console.error("Error fetching Student:", error);
            }
          };
      
          fetchStudent();
        const fetchExperiments = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/drive/experiments/${rollno}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setExperiments(data.experiments || []);
            } catch (error) {
                console.error("Error fetching Experiments:", error);
                setError("Failed to fetch experiments. Please try again later.");
            }
        };

        fetchExperiments();
    }, [rollno]);

    if (error) {
        return <div className="text-center text-red-500 mt-4">{error}</div>;
    }

    return (
<div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
  <div className="sticky top-0 left-0 right-0 z-20">
    <Header user="Student" />
  </div>
  <div className="flex flex-1 h-[calc(100vh-60px)] w-full overflow-hidden">
    <div className={`h-full bg-blue-800 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"}`}>
      <StudentSidebar userName={student?.name} rollNo={student?.rollno}/>
    </div>

    <div className="flex-1 p-12 overflow-auto">
      {experiments.length === 0 ? (
        <p className="text-center text-xl font-light text-gray-600">
          No experiments uploaded yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {experiments.map((experiment) => (
            <div
              key={experiment._id}
              className="group backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
              hover:shadow-[0_8px_30px_rgb(59,130,246,0.2)] transition-all duration-500 ease-in-out
              border border-gray-100 hover:border-blue-200"
            >
              <h3 className="text-2xl font-light text-gray-800 mb-4 group-hover:text-blue-600 transition-all duration-300">
                {experiment.subject_name}
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 flex items-center space-x-2">
                  <span className="text-gray-400">Uploaded By:</span>
                  <span className="font-medium">{student.name}</span>
                  <span className="text-gray-400">({student.rollno})</span>
                </p>
                <div className="text-sm text-gray-500 flex items-center space-x-2">
                  <span className="text-gray-400">File Path:</span>
                  <a
                    href={`http://localhost:3001${experiment.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 transition-colors underline-offset-4 hover:underline"
                  >
                    View File
                  </a>
                </div>
              </div>
              <button
                onClick={() => handleFileView(experiment.filePath)}
                className="mt-6 w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white 
                font-medium rounded-xl shadow-lg hover:shadow-blue-500/25 hover:translate-y-[-2px] 
                active:translate-y-[0px] transition-all duration-300 ease-in-out"
              >
                View File
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>

    );
};

// Function to handle file viewing
const handleFileView = (filePath) => {
    console.log(filePath)
    window.open(`http://localhost:3001${filePath}`, '_blank');
};

export default ViewExperiments;
