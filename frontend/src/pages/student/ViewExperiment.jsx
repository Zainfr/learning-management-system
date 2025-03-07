import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import StudentSidebar from "../../components/StudentSidebar";
import { Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewExperiments = () => {
  const [student, setStudent] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [error, setError] = useState(null);
  const [experiment, setExperiment] = useState([]);
  const { rollno } = useParams();
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchExperiments = async () => {
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
    fetchExperiments();
  }, [rollno]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
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

        <div className="flex-1 p-12 overflow-auto">
          {
            <div className="grid grid-cols-1 gap-6">
              {experiment?.map((experiment, index) => (
                <div
                  key={index}
                  className="flex items-center group backdrop-blur-sm bg-white/80 p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
              hover:shadow-[0_8px_30px_rgb(59,130,246,0.2)] transition-all duration-500 ease-in-out
              border border-gray-100 hover:border-blue-200"
                  onClick={() =>
                    navigate(
                      `/student/${id}/experiments/${experiment.subject_name}/${student.rollno}`
                    )
                  }
                >
                  <Folder className="text-blue-600 mr-2" />
                  <h3 className="text-xl cursor-pointer font-light text-gray-800 group-hover:text-blue-600 transition-all duration-300">
                    {experiment.subject_name}
                  </h3>
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </div>
  );
};

// // Function to handle file viewing
// const handleFileView = (filePath) => {
//   console.log(filePath);
//   window.open(`http://localhost:3001${filePath}`, "_blank");
// };

export default ViewExperiments;
