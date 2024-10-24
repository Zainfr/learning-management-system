import React, { useEffect, useState } from "react";
import SideBar from "../../components/SideBar";
import Papa from "papaparse";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from 'primereact/multiselect';


const CreateTeacher = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [formData, setFormData] = useState({
    teacher_name: "",
    subjects: "",
    email: "",
    password: "",
    mobile: "",
  });

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const subjectOptions = subjects.map((subjects) => ({
    label: subjects.name,
    value: subjects._id,
  }));

  const studentOptions = students.map((student) => ({
    label: student.name,
    value: student._id,
  }));

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/students`);
        const data = await response.json();
        setStudents(data.students);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    const fetchSubjects = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/subjects");
        if (!response.ok) {
          console.error(error);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          setSubjects(data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching Subjects:", error);
        setError("Failed to fetch Subjects. Please try again later.");
      }
    };

    fetchStudents();
    fetchSubjects();
  }, []);
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDropdownChange1 = (e) => {
    setFormData({
      ...formData,
      subjects: e.value, // e.value will now be an array of selected subjects
    });
  };
  

  const handleDropdownChange2 = (e) => {
    setFormData({
      ...formData,
      mentees: e.value, // e.value holds the selected subject's _id
    });
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

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:3001/teacher-csv-submit", {
        method: "POST",
        body: formData,
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
    
    if (!formData.subjects || formData.subjects.length === 0) {
      setMessage("Please select at least one subject.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3001/teacher-form-submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (response.ok) {
        setMessage(data.msg || "Teacher created successfully!");
      } else {
        setMessage(data.msg || "Failed to create teacher.");
      }
    } catch (error) {
      console.error("Error creating teacher:", error);
      setMessage("An error occurred. Please try again.");
    }
  };
  


  return (
    <div className="flex">
      <div className=" fixed z-20 h-screen w-64 md:block">
        <SideBar />
      </div>

      <div className="flex-grow md:ml-64">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 md:left-[256px] right-0 bg-white shadow-md p-6 z-10">
          <h1 className="text-3xl text-gray-700 font-semibold pl-8 ">
            Create Teacher
          </h1>
        </div>

        {/* Form and CSV Upload centered */}
        <div className="flex justify-center items-center h-full py-24 bg-gray-300">
          <div className="bg-white p-6 rounded-lg shadow-md mt-5 mb-5">
            <form onSubmit={handleSubmit}>
              <div className="mt-8 mb-4">
                <FloatLabel>
                  <InputText
                    id="teacher_name"
                    type="text"
                    name="teacher_name"
                    value={formData.teacher_name}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <label
                    htmlFor="teacher_name"
                    className="block text-gray-700 mb-2"
                  >
                    Teacher
                  </label>
                </FloatLabel>
              </div>
              <label htmlFor="subject" className="block text-gray-700 mb-2">
                Subject
              </label>
              <div className="mb-8">
                <MultiSelect
                  id="subject"
                  name="subjects"
                  value={formData.subjects} // Array of selected subjects
                  options={subjectOptions}
                  onChange={handleDropdownChange1}
                  placeholder="Select Subjects"
                  className={`w-full border-2 ${isFocused ? "border-indigo-500" : "border-gray-300"
                    } rounded-md`}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />

              </div>

              <div className="mb-8">
                <FloatLabel>
                  <InputText
                    id="email"
                    type="text"
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
              <div className="mb-8">
                <FloatLabel>
                  <InputText
                    id="password"
                    type="text"
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
              <div className="mb-8">
                <FloatLabel>
                  <InputText
                    id="mobile"
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <label htmlFor="mobile" className="block text-gray-700 mb-2">
                    Mobile No.
                  </label>
                </FloatLabel>
              </div>
              <button
                type="submit"
                className="w-full p-2 bg-blue-600 text-white rounded mb-4"
              >
                Submit
              </button>
            </form>

            <div className="p-6 py-8">
              <h1 className="text-2xl font-semibold mb-4">Upload CSV</h1>
              <form onSubmit={handleCSVSubmit} encType="multipart/form-data">
                <div className="mb-4">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="border border-gray-300 rounded p-2"
                  />
                </div>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload CSV"}
                </button>
              </form>
              {message && <p className="mt-4 text-gray-700">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTeacher;
