import React, { useState } from "react";
import Header from "../../components/Header";

const CreateAssignment = () => {
  const [title, setTitle] = useState("");
  const [faculty, setFaculty] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("Assignment uploaded successfully!");
    setTitle("");
    setFaculty("");
    setFile(null);
  };
  return (
    <div>
      <Header user="Teacher" />
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-12">
        <h2 className="text-xl font-semibold mb-4">Upload a Assignment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Assignment Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded-lg w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Faculty Name</label>
            <input
              type="text"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              className="border rounded-lg w-full p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Upload File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="border rounded-lg w-full p-2"
              accept=".pdf"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 focus:outline-none"
          >
            Upload Book
          </button>
          {message && (
            <p className="mt-4 font-semibold text-green-500">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateAssignment;
