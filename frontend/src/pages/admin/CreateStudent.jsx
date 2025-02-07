import React, { useState, useEffect } from "react";
import SideBar from "../../components/SideBar";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import MessageModal from "../../components/MessageModal";

const CreateStudent = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalConent, setModalContent] = useState({
    title: "",
    message: "",
    success: true,
  });
  const handleClose = () => setShowModal(false);
  const [error, setError] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    rollno: "",
    mobile: "",
    sem: "",
    mentor: "",
    email: "",
    password: "",
  });
  const teacherOptions = teachers.map((teacher) => ({
    label: teacher.teacher_name,
    value: teacher._id,
  }));

  const semesterOptions = semesters.map((semester) => ({
    label: semester.semester,
    value: semester._id,
  }));

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/semesters");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setSemesters(data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching semesters:", error);
        setError("Failed to fetch semesters. Please try again later.");
      }
    };

    fetchSemesters();

    const fetchTeachers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/teachers");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setTeachers(data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching Teachers:", error);
        setError("Failed to fetch Teachers. Please try again later.");
      }
    };

    fetchTeachers();
  }, []);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCSVSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    const formDataForUpload = new FormData();
    formDataForUpload.append("file", file);

    setUploading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:3001/importUser", {
        method: "POST",
        body: formDataForUpload,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.msg || "File uploaded successfully!");
      } else {
        setMessage(data.msg || "File upload failed.");
      }
    } catch (error) {
      setMessage("An error occurred during file upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch("http://localhost:3001/form-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setModalContent({
          title: "Error",
          message: `Failed to create Student 😨 `,
          success: false,
        });
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        setModalContent({
          title: "Success.",
          message: "Student created successfully 😁!!",
          success: true,
        });
      }

      const data = await response.json();
      console.log("Response Data:", data);
      console.log("Form Data:", formData);
      setMessage("Student created successfully!");
    } catch (error) {
      console.log("Form submission error:", error);
      setMessage("Failed to create student. Please try again.");
      setModalContent({
        title: "Error",
        message: `Failed to create Student 😨 ${error}`,
        success: false,
      });
    }
    setShowModal(true);
  };

  return (
    <div className="flex">
      {/* Fixed Sidebar */}
      <div className=" fixed z-20 h-screen w-64 md:block">
        <SideBar />
      </div>

      <div className="flex-grow md:ml-64">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 md:left-[256px] right-0 bg-white shadow-md p-6 z-10">
          <h1 className="text-3xl text-gray-700 font-semibold pl-8">
            Create Student
          </h1>
        </div>

        {/* Form and CSV Upload centered */}
        <div className="flex justify-center items-center h-full pt-24 bg-gradient-to-t from-blue-50 to-blue-200">
          <div className="bg-white p-6 rounded-lg shadow-md mt-5 mb-5">
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <FloatLabel>
                  <InputText
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <label htmlFor="name" className="block text-gray-700 mb-2">
                    Name
                  </label>
                </FloatLabel>
              </div>
              <div className="mb-8">
                <FloatLabel>
                  <InputText
                    id="rollno"
                    type="text"
                    name="rollno"
                    value={formData.rollno}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <label htmlFor="rollno" className="block text-gray-700 mb-2">
                    Roll No.
                  </label>
                </FloatLabel>
              </div>
              <div className="mb-4">
                <FloatLabel>
                  <InputText
                    id="mobile"
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <label htmlFor="mobile" className="block text-gray-700 mb-2">
                    Mobile Number
                  </label>
                </FloatLabel>
              </div>
              <div className="mb-4">
                <label htmlFor="semester" className="block text-gray-700 mb-2">
                  Semester
                </label>
                <Dropdown
                  id="sem"
                  name="sem"
                  value={formData.sem}
                  options={semesterOptions}
                  onChange={handleChange}
                  placeholder="Select Semester"
                  className={`w-full border-2 ${
                    isFocused ? "border-indigo-500" : "border-gray-300"
                  } rounded-md`}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </div>
              <div className="mb-8">
                <label htmlFor="mentor" className="block text-gray-700 mb-2">
                  Mentor
                </label>
                <Dropdown
                  id="mentor"
                  name="mentor"
                  value={formData.mentor}
                  options={teacherOptions}
                  onChange={handleChange}
                  placeholder="Select Mentor"
                  className={`w-full border-2 ${
                    isFocused ? "border-indigo-500" : "border-gray-300"
                  } rounded-md`}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </div>
              <div className="mb-8">
                <FloatLabel>
                  <InputText
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <label htmlFor="email" className="block text-gray-700 mb-2">
                    Email
                  </label>
                </FloatLabel>
              </div>
              <div className="mb-4">
                <FloatLabel>
                  <InputText
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <label
                    htmlFor="password"
                    className="block text-gray-700 mb-2"
                  >
                    Password
                  </label>
                </FloatLabel>
              </div>

              <button
                type="submit"
                className="w-full p-2 bg-blue-600 text-white rounded mb-4"
              >
                Submit
              </button>
              {error && <p className="text-red-500">{error}</p>}
              {message && <p className="text-green-500">{message}</p>}
            </form>
            <div className="p-6">
              <h1 className="text-2xl font-semibold mb-4">Upload CSV</h1>
              <form onSubmit={handleCSVSubmit} encType="multipart/form-data">
                <div className="mb-4">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full p-2 bg-blue-600 text-white rounded mb-4"
                >
                  {uploading ? "Uploading..." : "Upload CSV"}
                </button>
              </form>
              {message && <p className="mt-4 text-gray-700">{message}</p>}
            </div>
            <MessageModal
              show={showModal}
              handleClose={handleClose}
              title={modalConent.title}
              message={modalConent.message}
              success={modalConent.success}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStudent;
