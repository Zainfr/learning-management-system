import React from "react";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import StudentSidebar from "../../components/StudentSidebar";
import { useParams } from "react-router-dom";
import { File } from "lucide-react";

const ViewSpecificExperiment = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [student, setStudent] = useState({});
  const [experiment, setExperiment] = useState({});
  const { id, subject_name } = useParams();
  console.log(subject_name, id); // Debug log
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/student/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setStudent(data.student);
      } catch (error) {
        console.error("Error fetching Student:", error);
      }
    };

    const fetchExperiment = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/drive/subject/${id}/experiments/${subject_name}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setExperiment(data);
      } catch (error) {
        console.error("Error fetching Student:", error);
      }
    };
    fetchExperiment();
    fetchStudent();
  }, []);

  const handleFileView = (filePath) => {
    console.log(filePath);
    window.open(`http://localhost:3001${filePath}`, "_blank");
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="sticky top-0 left-0 right-0 z-20">
        <Header user="Student" />
      </div>
      <div className="flex flex-1 h-[calc(100vh-60px)] w-full overflow-hidden">
        <div
          className={`h-full bg-blue-800 transition-all duration-300 ${
            isSidebarOpen ? "w-64" : "w-16"
          }`}
        >
          <StudentSidebar userName={student?.name} rollNo={student?.rollno} />
        </div>

        <div className="flex-1 p-12 overflow-auto">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            {" "}
            Experiments for {subject_name}
          </h1>
          <div className="grid grid-cols-1 gap-6">
            {experiment.experiments?.length === 0 ? (
              <p className="text-center text-red-500 mt-4">
                No experiments found
              </p>
            ) : (
              experiment.experiments?.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center group backdrop-blur-sm bg-white/80 p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                hover:shadow-[0_8px_30px_rgb(59,130,246,0.2)] transition-all duration-500 ease-in-out
                border border-gray-100 hover:border-blue-200"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-4">
                      <File size={24} />
                      <div
                        className="text-lg cursor-pointer font-light text-gray-800 group-hover:text-blue-600 transition-all duration-300"
                        onClick={() => handleFileView(file.filePath)}
                      >
                        Experiment {index + 1}
                      </div>
                    </div>
                    <button
                      className="text-blue-500"
                      onClick={() => handleFileView(file.filePath)}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSpecificExperiment;
