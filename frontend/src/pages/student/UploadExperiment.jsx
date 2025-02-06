import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import StudentSidebar from "../../components/StudentSidebar";

const UploadExperiment = () => {
  const [student, setStudent] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedExperimentIndex, setSelectedExperimentIndex] = useState(null);
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
  }, [id]);

  const handleUploadClick = (index) => {
    setSelectedExperimentIndex(index);
    setShowModal(true);
  };

  const handleFileChange = (event) => {
    setUploadedFile(event.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadedFile) {
      setMessage("Please upload a file");
      return;
    }
    
    const experiment = student?.experiments[selectedExperimentIndex];
    console.log("Selected experiment:", experiment); // Debug log

    if (!experiment) {
      setMessage("No experiment selected");
      return;
    }

    
    const encodedSubjectName = encodeURIComponent(experiment.subject_name);

    // // Use folder_path to extract subject name
    // const folderPath = experiment;
    // console.log("Folder path:", folderPath); // Debug log

    // const subjectName = folderPath.split('/').pop();
    // const encodedSubjectName = encodeURIComponent(subjectName);


    // if (!subjectName) {
    //   setMessage("Unable to determine subject name");
    //   return;
    // }q


    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("rollNo", student?.rollno);

    try {
      const url = `http://localhost:3001/api/drive/student/upload/${student?.rollno}/${encodedSubjectName}`;
      console.log("Request URL:", url); // Debug log

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Server response:", data); // Debug log

      if (data.success) {
        setMessage(`Experiment uploaded successfully: ${data.filePath}`);
        // Optionally, update the student state here to reflect the new upload
      } else {
        setMessage(`Upload failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting experiment:", error);
      setMessage(`Error submitting experiment: ${error.message}`);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="sticky top-0 left-0 right-0 z-20">
        <Header user="Student" />
      </div>
      <div className="flex flex-1 h-[calc(100vh-60px)] w-full overflow-hidden">
    <div className={`h-full bg-blue-800 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"}`}>
      <StudentSidebar userName={student?.name} rollNo={student?.rollno}/>
    </div>
        <div className="max-w-5xl ml-6 p-4 flex flex-col">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Upload Experiment</h2>
          {student?.experiments?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
              {student?.experiments?.map((experiment, index) => (
                <div
                  key={index}
                  className="bg-blue-100 shadow-md rounded-lg p-6 hover:bg-blue-200 transition transform hover:scale-95 flex flex-col justify-between folder relative"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 w-full h-full text-blue-900 opacity-10"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                  >
                    <path
                      d="M3 7h4l2 2h10a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                    />
                  </svg>
                  <div>
                    <p className="text-lg font-semibold text-blue-900 mb-2 relative z-10">
                      Folder: {index + 1}
                    </p>
                    <p className="text-sm text-gray-700 truncate break-all relative z-10">
                      {experiment.subject_name}
                    </p>
                  </div>
                  <div className="mt-4 text-sm relative z-10">
                    <button
                      className="text-white hover:text-gray-800 bg-blue-600 hover:bg-blue-400 px-4 py-2 rounded"
                      onClick={() => handleUploadClick(index)}
                    >
                      Upload File
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">NO Folder Found</p>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full relative"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h3 className="text-xl font-bold mb-4">Upload File</h3>
              {uploadedFile ? (
                <p className="text-gray-700 mb-4">
                  Uploaded File: {uploadedFile.name}
                </p>
              ) : (
                <p className="text-gray-600 mb-4">No file uploaded yet.</p>
              )}
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              {message && <p className="p-2 text-green-400">{message}</p>}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-4 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Upload
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadExperiment;
