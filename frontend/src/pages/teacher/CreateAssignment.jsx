import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import TeacherSidebar from "../../components/TeacherSidebar";

import { Calendar } from "primereact/calendar";

import Header from "../../components/Header";

const CreateAssignment = () => {
  const [teachera, setTeacher] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const teacherId = teachera.teacher?._id;
  const [assignment, setAssignment] = useState({
    subjectId: "",
    teacher: "",
    title: "",
    description: "",
    dueDate: Date,
  });
  const subjectOptions = teachera.teacher?.subjects.map((subject) => ({
    label: subject.name,
    value: subject._id,
  }));
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssignment({
      ...assignment,
      [name]: value,
    });
  };
  const handleDropdownChange1 = (e) => {
    setAssignment({
      ...assignment,
      subjectId: e.value, // e.value holds the selected subject's _id
    });
  };
  useEffect(() => {
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

    fetchSubjects();

    const fetchTeacher = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/teacher/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTeacher(data);
      } catch (error) {
        console.error("Error fetching Teachers:", error);
        setError("Failed to fetch Teachers. Please try again later.");
      }
    };

    fetchTeacher();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(assignment);
    try {
      const response = await fetch("http://localhost:3001/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectId: assignment.subjectId,
          teacher: teacherId,
          title: assignment.title,
          description: assignment.description,
          dueDate: assignment.dueDate,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setMessage("Assignment uploaded successfully!");
        setAssignment({
          subjectId: "",
          teacher: teachera.teacher?.teacher_name,
          title: "",
          description: "",
          dueDate: "",
        });
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      setMessage("Failed to upload assignment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="sticky top-0 left-0 right-0 z-20">
        <Header user="Teacher" />
      </div>

      <div className="flex flex-1 h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div
          className={`h-full bg-blue-800 transition-all duration-300 ${
            isSidebarOpen ? "w-64" : "w-16"
          }`}
        >
          <TeacherSidebar
            userName={teachera?.teacher?.teacher_name}
            rollNo={teachera?.teacher?.email}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8">
              Create Assignment
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <FloatLabel>
                  <InputText
                    id="title"
                    type="text"
                    name="title"
                    value={assignment.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <label htmlFor="title" className="text-gray-600">
                    Assignment Title
                  </label>
                </FloatLabel>
              </div>

              {/* Teacher Input */}
              <div className="space-y-2">
                <label
                  htmlFor="teacher"
                  className="block text-sm font-medium text-gray-700"
                >
                  Teacher
                </label>
                <input
                  value={teachera.teacher?.teacher_name || "Error"}
                  type="text"
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
                />
              </div>

              {/* Subject Dropdown */}
              <div className="space-y-2">
                <Dropdown
                  id="subject"
                  name="subjects"
                  value={assignment.subjectId}
                  options={subjectOptions}
                  onChange={handleDropdownChange1}
                  placeholder="Select Subject"
                  className={`w-full border ${
                    isFocused ? "border-blue-500" : "border-gray-200"
                  } rounded-lg`}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </div>

              {/* Description Textarea */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  onChange={handleChange}
                  value={assignment.description}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter description here"
                />
              </div>

              {/* Due Date Calendar */}
              <div className="space-y-2">
                <label
                  htmlFor="due_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Due Date
                </label>
                <Calendar
                  id="due_date"
                  value={assignment.dueDate}
                  onChange={handleChange}
                  className="w-full"
                  dateFormat="dd-mm-yy"
                  showIcon
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg 
              shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Create Assignment
              </button>

              {/* Success Message */}
              {message && (
                <p className="mt-4 text-center text-sm font-medium text-green-500">
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignment;
