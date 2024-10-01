import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";

import { Calendar } from "primereact/calendar";

import Header from "../../components/Header";

const CreateAssignment = () => {
  const [teachera, setTeacher] = useState({});
  const [subjects, setSubjects] = useState([]);
  const teacherId = teachera.teacher?._id;
  const [assignment, setAssignment] = useState({
    subjectId: "",
    teacher: "",
    title: "",
    description: "",
    dueDate: Date,
  });
  const subjectOptions = subjects.map((subjects) => ({
    label: subjects.name,
    value: subjects._id,
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
    <div className="absolute left-0 right-0 bg-gray-200 h-full">
      <Header user="Teacher" />
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-12">
        <h2 className="text-xl font-semibold mb-4">Upload Assignment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-8 mb-4">
            <FloatLabel>
              <InputText
                id="title"
                type="text"
                name="title"
                value={assignment.title}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <label htmlFor="title" className="block text-gray-700 mb-2">
                Assignment Title
              </label>
            </FloatLabel>
          </div>
          <div className="mb-8">
            <label htmlFor="teacher" className="block text-gray-700 mb-2">
              Teacher
            </label>
            <input
              value={teachera.teacher?.teacher_name || "Error"}
              type="text"
              className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-8">
            <Dropdown
              id="subject"
              name="subjects"
              value={assignment.subjectId} // Ensure this points to the correct state
              options={subjectOptions}
              onChange={handleDropdownChange1} // Use the new handleDropdownChange function
              placeholder="Select Subject"
              className={`w-full border-2 ${
                isFocused ? "border-indigo-500" : "border-gray-300"
              } rounded-md`}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              onChange={handleChange}
              value={assignment.description}
              className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter description here"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="due_date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Due Datea
            </label>
            <Calendar
              id="due_date"
              value={assignment.dueDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
              dateFormat="dd-mm-yy" // Example format, you can customize
              showIcon // To display a calendar icon next to the input
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 focus:outline-none"
          >
            Upload Assignment
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
