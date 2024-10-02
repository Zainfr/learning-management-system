import { useState } from "react";
import MessageModal from "../../components/MessageModal";
import { useNavigate } from "react-router-dom";

const UploadAssignment = () => {
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Only PDF files are allowed");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      // Handle file upload logic here
      console.log("File uploaded:", file.name);
      navigate("/student/dashboard"); // Redirect after submission
    } else {
      setError("Please upload a valid PDF file before submitting.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-500 to-gray-600">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-lg shadow-xl text-center max-w-lg w-full"
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-700">
          Upload Your Assignment
        </h1>
        <p className="text-gray-500 mb-4">
          Please upload your assignment in{" "}
          <span className="font-semibold">PDF</span> format.
        </p>

        <div className="mb-4">
          <label
            htmlFor="file-upload"
            className="block bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            {file ? "Change File" : "Choose PDF"}
          </label>
          <input
            id="file-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          {file && (
            <p className="text-gray-600 mt-2">
              Selected File: <span className="font-semibold">{file.name}</span>
            </p>
          )}
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300 ease-in-out"
        >
          Submit Assignment
        </button>

        <div className="mt-6 text-gray-500 text-sm">
          <p>Accepted file format: PDF only</p>
          <p>
            Having trouble?{" "}
            <a
              href="#"
              onClick={() => setShowModal(true)}
              className="text-blue-400 hover:underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </form>

      <MessageModal
        show={showModal}
        handleClose={handleClose}
        title={"Sorry 😌"}
        message={"There is no Support, even we need support 😟"}
        success={false}
      />
    </div>
  );
};

export default UploadAssignment;
