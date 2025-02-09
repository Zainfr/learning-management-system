import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import TeacherSidebar from "../../components/TeacherSidebar";
import { Upload } from "lucide-react";

const UploadStudyMaterial = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState({});
  const [uploadedFile, setUploadedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
  });

  // Fetch teacher details
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/teacher/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTeacher(data.teacher);
        setFormData((prev) => ({
          ...prev,
          email: data.teacher.email, // Update email after fetching teacher
        }));
      } catch (error) {
        console.error("Error fetching Teacher:", error);
      }
    };
    fetchTeacher();
  }, [id]);

  const handleFileChange = (event) => {
    setUploadedFile(event.target.files[0]);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadedFile) {
      setMessage("Please upload a file");
      return;
    }

    // Correctly create a FormData object
    const uploadData = new FormData();
    uploadData.append("file", uploadedFile);
    uploadData.append("email", teacher?.email || "");

    console.log("Uploading file:", uploadData);
    const uriEncodedSubject = encodeURIComponent(formData.subject);
    const uriEncodedTeacher = encodeURIComponent(teacher?.teacher_name);

    try {
      const response = await fetch(
        `http://localhost:3001/api/drive/teacher/upload/${uriEncodedTeacher}/${uriEncodedSubject}`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setMessage("File uploaded successfully");
    } catch (error) {
      setMessage("Error uploading file");
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="sticky top-0 left-0 right-0 z-20">
        <Header user="Teacher" />
      </div>

      <div className="flex flex-1 h-[calc(100vh-60px)] overflow-hidden">
        <TeacherSidebar
          userName={teacher?.teacher_name}
          rollNo={teacher?.email}
        />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                <Upload className="h-6 w-6" />
                Upload Study Material
              </h2>

              <form className="space-y-6" onSubmit={handleUpload}>
                {/* Subject Selection */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="subject"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    onChange={handleChange}
                    value={formData.subject}
                    required
                  >
                    <option value="">Select Subject</option>
                    {teacher?.subjects?.map((subject, index) => (
                      <option key={index} value={subject.name}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="file"
                  >
                    File
                  </label>
                  <div className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition cursor-pointer">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file"
                          className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file"
                            name="file"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX up to 10MB
                      </p>
                    </div>

                    {/* Show selected file name */}
                    {uploadedFile && (
                      <p className="mt-2 text-sm text-gray-600 font-medium">
                        Selected file:{" "}
                        <span className="text-blue-600">
                          {uploadedFile.name}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Upload Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium transition"
                >
                  Upload Study Material
                </button>
              </form>

              {/* Message Display */}
              {message && <p className="p-2 text-green-400">{message}</p>}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UploadStudyMaterial;
