import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";

const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState({});
  const [selectedFile, setSelectedFile] = useState(null); // State for selected file

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/${assignmentId}/assignment`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch assignments");
        }
        const data = await response.json();
        setAssignment(data);
      } catch (error) {
        console.error("Error fetching assignment:", error);
      }
    };

    fetchAssignment();

    const fetchSubmissions = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/${assignmentId}/submissions`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch submissions");
        }
        const data = await response.json();
        setSubmissions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId]);

  // const handleFileClick = (fileUrl, fileName) => {
  //   setSelectedFile([
  //     {
  //       uri: `http://localhost:3001/uploads/assignments/${assignmentId}/${fileName}`,
  //       fileType: "pdf",
  //       fileName: fileName,
  //     },
  //   ]);
  // };

  // Function to handle file viewing
  const handleFileClick = (filePath) => {
    const actualFilePath = "/" + filePath.substring(filePath.indexOf("uploads"));
    window.open(`http://localhost:3001${actualFilePath}`, '_blank');
  };


  const handleCloseViewer = () => {
    setSelectedFile(null);
  };

  if (loading) {
    return <div>Loading submissions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Header user="Teacher" />
      <div className="bg-blue-200 h-screen">
        <div className="max-w-3xl mx-auto p-4">
          <h2 className="text-2xl font-semibold mb-4">
            Submissions for Assignment: {assignment?.title}
          </h2>
          {submissions.length > 0 ? (
            <ul className="bg-white shadow rounded-lg divide-y divide-gray-200 hover:bg-gray-100 transition">
              {submissions.map((submission, index) => (
                <li
                  key={index}
                  className="p-4 hover:bg-gray-100 hover:cursor-pointer hover:scale-95 transition"
                  onClick={() =>
                    handleFileClick(submission.filePath)
                  } // Handle file click
                >
                  <p className="text-sm text-gray-600">
                    <strong>Roll No:</strong> {submission.rollNo}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>File Name:</strong> {submission.fileName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Submission Date:</strong>{" "}
                    {new Date(submission.submissionDate).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center py-4">
              No submissions found for this assignment.
            </p>
          )}
        </div>
      </div>

    </div>);
};

export default SubmissionsPage;
