import React from "react";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const EditStudentModal = ({
  isOpen,
  onClose, // This will handle closing the modal
  student, // The student to be edited
  onSave, // Function to handle saving the updated student
  error,
  message,
}) => {
  const [semesters, setSemesters] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [formData, setFormData] = useState({
    name: student.name || "",
    rollno: student.rollno || "",
    mobile: student.mobile || "",
    sem: student.sem || "",
    mentor: student.mentor || "",
    email: student.email || "",
    password: "",
  });
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

  const semesterOptions = semesters.map((semester) => ({
    label: semester.semester,
    value: semester._id,
  }));

  const teacherOptions = teachers.map((teacher) => ({
    label: teacher.teacher_name,
    value: teacher._id,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 0.8 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white p-6 rounded-lg shadow-lg w-1/3 h-fit relative top-10"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-8">Edit Student</h2>

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
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

          {/* Roll No. Field */}
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
              className={`w-full border-2 ${isFocused ? "border-indigo-500" : "border-gray-300"
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
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
            </FloatLabel>
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded mb-4"
          >
            Save Changes
          </button>

          {error && <p className="text-red-500">{error}</p>}
          {message && <p className="text-green-500">{message}</p>}
        </form>
      </motion.div>
    </div>
  );
};

export default EditStudentModal;
