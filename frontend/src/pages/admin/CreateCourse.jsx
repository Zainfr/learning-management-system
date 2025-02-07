import React, { useState, useEffect } from "react";
import SideBar from "../../components/SideBar";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import MessageModal from "../../components/MessageModal";

const CreateCourse = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalConent, setModalContent] = useState({
    title: "",
    message: "",
    success: true,
  });
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [formData, setFormData] = useState({
    course_name: "",
    sem: "",
  });
  const [error, setError] = useState(null);
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
  }, []);

  const handleClose = () => setShowModal(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/create-course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        setModalContent({
          title: "Error",
          message: `Failed to create Course 😨 `,
          success: false,
        });
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        setModalContent({
          title: "Success.",
          message: "Course created successfully 😁!!",
          success: true,
        });
      }

      const data = await response.json();
      console.log("Response Data:", data);
      console.log("Form Data:", formData);
      setMessage("Course created successfully!");
      console.log(response);
      console.log("Form Data:", formData);
    } catch (error) {
      setMessage("Failed to create Course. Please try again.");
      setModalContent({
        title: "Error",
        message: `Failed to create Course 😨 ${error}`,
        success: false,
      });
    }
    setShowModal(true);
  };

  return (
    <div className="flex">
      <div className=" fixed z-20 h-screen w-64 md:block">
        <SideBar />
      </div>

      <div className="flex-grow md:ml-64">
        <div className="fixed top-0 left-0 md:left-[256px] right-0 bg-white shadow-md p-6 z-10">
          <h1 className="text-3xl text-gray-700 font-semibold pl-8">
            Create Course
          </h1>
        </div>

        <div className="flex justify-center items-center h-screen pt-24 bg-gradient-to-t from-blue-50 to-blue-200">
          <div className="bg-white p-6 rounded-lg shadow-md mt-5 mb-5">
            <form onSubmit={handleSubmit}>
              <div className="my-8">
                <FloatLabel>
                  <InputText
                    id="course-name"
                    type="text"
                    name="course_name"
                    value={formData.course_name}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <label htmlFor="name" className="block text-gray-700 mb-2">
                    Course Name
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
              <button
                type="submit"
                className="w-full p-2 bg-blue-600 text-white rounded mb-4"
              >
                Submit
              </button>
              {error && <p className="text-red-500">{error}</p>}
              {message && <p className="text-green-500">{message}</p>}
            </form>
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

export default CreateCourse;
