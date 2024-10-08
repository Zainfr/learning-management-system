import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion

const UploadExperiment = () => {
  const [student, setStudent] = useState({});
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
      setMessage("Plaese Upload a file");
      return;
    }
    const subjectPath =
      student?.experiments[selectedExperimentIndex]?.folder_path;
    const subName = subjectPath.split("\\").pop();
    const encodedSubName = encodeURIComponent(subName);

    const formData = new FormData();

    formData.append("file", uploadedFile);

    formData.append("rollNo", student?.rollno);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      console.log(
        `Fetching: http://localhost:3001/upload/${student?.rollno}/${encodedSubName}`
      );

      const response = await fetch(
        `http://localhost:3001/upload/${student?.rollno}/${encodedSubName}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      // // Log the response status and body
      // const responseBody = await response.text(); // Get response as text
      // console.log("Response Status:", response.status);
      // console.log("Response Body:", responseBody); // Log the body

      // // Attempt to parse JSON
      // const data = JSON.parse(responseBody);

      if (response.ok) {
        setMessage(`Experiment Uploaded Successfully: ${data.fileName}`);
      }
      console.log(data);
    } catch (error) {
      console.error("Error submitting experiment:", error);
      setMessage("Error submitting Experiment");
    }
    console.log("Uploading:", uploadedFile);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Header user="Student" />
      <div className="flex justify-center items-center">
        <div className="max-w-5xl mx-auto p-4 flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold mb-4">Upload Experiment</h2>
          {student?.experiments?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
              {student?.experiments?.map((experiment, index) => (
                <div
                  key={index}
                  className="bg-blue-100 shadow-md rounded-lg p-6 hover:bg-blue-200 transition transform hover:scale-95 flex flex-col justify-between"
                >
                  <div>
                    <p className="text-lg font-semibold text-blue-900 mb-2">
                      Folder: {index + 1}
                    </p>
                    <p className="text-sm text-gray-700 truncate break-all">
                      {experiment.folder_path.split("\\").pop()}
                    </p>
                  </div>
                  <div className="mt-4 text-sm text-right">
                    <button
                      className="text-blue-600 hover:text-blue-800"
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
