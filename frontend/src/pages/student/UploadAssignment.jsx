import { useState, useEffect } from "react";
import MessageModal from "../../components/MessageModal";
import { useNavigate, useParams } from "react-router-dom";

const UploadAssignment = () => {
  const [assignment, setAssignment] = useState(null);
  const [file, setFile] = useState(null);
  const [rollNo, setRollNo] = useState("");
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  // const navigate = useNavigate();
  const { id, assignmentId } = useParams();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/${assignmentId}/assignment`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch assignment");
        }
        const data = await response.json();
        setAssignment(data);
      } catch (error) {
        console.error("Error fetching assignment:", error);
      }
    };

    fetchAssignment();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !rollNo) {
      setMessage("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("assignment", file); // Append the file
    formData.append("rollNo", rollNo);
    console.log(formData);

    try {
      const response = await fetch(
        `http://localhost:3001/${assignmentId}/submit`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(`Assignment submitted successfully: ${data.fileName}`);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      setMessage("Error submitting assignment");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-gray-500 to-gray-600">
      <h1 className="text-gray-900 font-bold text-3xl p-2">
        {assignment?.title || "Title"}
      </h1>
      <h2 className="text-gray-900 font-semibold text-xl p-2">
        {assignment?.description || "Descriptioon"}
      </h2>
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
        <div className="mb-6">
          <label
            htmlFor="rollNo"
            className="block text-gray-700 font-medium mb-2"
          >
            Roll Number:
          </label>
          <input
            id="rollNo"
            type="text"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
            placeholder="Enter your Roll Number in Capitals"
          />
        </div>

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
        {message && <p className="text-green-600">{message}</p>}
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
