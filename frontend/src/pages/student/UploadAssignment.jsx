import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import StudentSidebar from "../../components/StudentSidebar";
import MessageModal from "../../components/MessageModal";
import { Calendar, FileText, Upload, AlertCircle, CheckCircle, ArrowLeft, UploadCloud, Clock, X, File } from "lucide-react";

const UploadAssignment = () => {
  const [assignment, setAssignment] = useState(null);
  const [file, setFile] = useState(null);
  const [rollNo, setRollNo] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [student, setStudent] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { id, assignmentId } = useParams();

  // Format due date and calculate time remaining
  const formatDueDate = (dueDate) => {
    if (!dueDate) return "No due date";
    return new Date(dueDate).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTimeRemaining = (dueDate) => {
    if (!dueDate) return { text: "No deadline", status: "normal" };

    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`,
        status: "overdue"
      };
    } else if (diffDays === 0) {
      return { text: "Due today", status: "urgent" };
    } else if (diffDays === 1) {
      return { text: "Due tomorrow", status: "soon" };
    } else if (diffDays <= 3) {
      return { text: `${diffDays} days remaining`, status: "soon" };
    } else {
      return { text: `${diffDays} days remaining`, status: "normal" };
    }
  };

  useEffect(() => {
    const fetchAssignment = async () => {
      setIsLoading(true);
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
        setError("Failed to load assignment details");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchStudent = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/student/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setStudent(data?.student);
        if (data?.student?.rollno) {
          setRollNo(data.student.rollno);
        }
      } catch (error) {
        console.error("Error fetching Student:", error);
      }
    };

    fetchAssignment();
    fetchStudent();
  }, [assignmentId, id]);

  const handleClose = () => setShowModal(false);

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
      setError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("assignment", file);
    formData.append("rollNo", rollNo);

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
        setSuccessMessage(`Assignment submitted successfully!`);
        setFile(null);
        // Reset the form or navigate away after successful submission
        setTimeout(() => {
          navigate(`/student/${id}/assignments`);
        }, 2000);
      } else {
        setError(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      setError("Error submitting assignment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get time remaining status and text
  const timeInfo = assignment?.dueDate ? getTimeRemaining(assignment.dueDate) : { text: "", status: "" };
  const statusColors = {
    overdue: "text-red-500",
    urgent: "text-amber-500",
    soon: "text-amber-500",
    normal: "text-green-500"
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="sticky top-0 left-0 right-0 z-20">
        <Header user="Student" />
      </div>

      <div className="flex flex-1 h-[calc(100vh-60px)] w-full overflow-hidden">
        <div className={`h-full bg-blue-800 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"}`}>
          <StudentSidebar userName={student?.name} rollNo={student?.rollno} />
        </div>

        <div className="flex-1 bg-gray-50 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <button
              onClick={() => navigate(`/student/${id}/assignments`)}
              className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors duration-200"
            >
              <ArrowLeft className="mr-2" size={18} />
              <span>Back to Assignments</span>
            </button>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Assignment Details Card */}
                <div className="md:col-span-1 bg-white rounded-2xl shadow-md p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="text-blue-600" size={18} />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">Assignment Details</h3>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-2">{assignment?.title || "Assignment Title"}</h2>
                      <p className="text-gray-600">{assignment?.description || "No description available"}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center text-gray-600 mb-3">
                        <Calendar size={16} className="mr-2" />
                        <span>Due: {formatDueDate(assignment?.dueDate)}</span>
                      </div>

                      <div className="flex items-center">
                        <Clock size={16} className={`mr-2 ${statusColors[timeInfo.status]}`} />
                        <span className={`${statusColors[timeInfo.status]} font-medium`}>
                          {timeInfo.text}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        Submit your work in PDF format only. Make sure your name and roll number are included in the document.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Upload Form Card */}
                <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Upload className="text-blue-600" size={18} />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">Submit Your Assignment</h3>
                  </div>

                  {successMessage ? (
                    <div className="flex flex-col items-center justify-center py-10">
                      <div className="p-4 bg-green-100 rounded-full mb-4">
                        <CheckCircle className="text-green-500" size={32} />
                      </div>
                      <h3 className="text-xl font-semibold text-green-600 mb-2">{successMessage}</h3>
                      <p className="text-gray-500 text-center mb-6">
                        Your assignment has been successfully submitted. Redirecting to assignments page...
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="rollNo" className="block text-gray-700 font-medium mb-2">
                          Roll Number:
                        </label>
                        <input
                          id="rollNo"
                          type="text"
                          value={rollNo}
                          onChange={(e) => setRollNo(e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                          placeholder="Enter your Roll Number"
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-gray-700 font-medium mb-2">
                          Assignment PDF:
                        </label>

                        {file ? (
                          <div className="flex items-center p-4 border-2 border-blue-200 border-dashed rounded-lg bg-blue-50">
                            <div className="p-2 bg-white rounded-md mr-3">
                              <File className="text-blue-500" size={24} />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 truncate" title={file.name}>
                                {file.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFile(null)}
                              className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                            >
                              <X size={16} className="text-gray-600" />
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-gray-300 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                            <input
                              id="file-upload"
                              type="file"
                              accept="application/pdf"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <label
                              htmlFor="file-upload"
                              className="cursor-pointer flex flex-col items-center"
                            >
                              <UploadCloud className="text-blue-500 mb-2" size={36} />
                              <span className="text-blue-600 font-medium">Click to upload PDF</span>
                              <span className="text-gray-500 text-sm mt-1">or drag and drop</span>
                            </label>
                          </div>
                        )}
                      </div>

                      {error && (
                        <div className="flex items-center p-3 bg-red-50 text-red-600 rounded-lg">
                          <AlertCircle size={16} className="mr-2" />
                          <p>{error}</p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting || !file || !rollNo}
                        className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-white font-medium ${isSubmitting || !file || !rollNo
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                          } transition duration-300`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={18} />
                            <span>Submit Assignment</span>
                          </>
                        )}
                      </button>

                      <div className="text-center">
                        <p className="text-gray-500 text-sm">
                          Having trouble?{" "}
                          <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="text-blue-500 hover:underline"
                          >
                            Contact Support
                          </button>
                        </p>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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