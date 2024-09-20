import React, { useState, useEffect } from "react";
import SideBar from "../../components/SideBar";
import ConfirmationModal from "../../components/ConfirmationModal";
import EditStudentModal from "../../components/EditStudentModal";

const AdminDashboard = () => {
  const [numberOfStudents, setNumberOfStudents] = useState(null);
  const [numberOfTeachers, setNumberOfTeachers] = useState(null);
  const [numberofCourses, setNumberOfCourses] = useState(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEntryType, setCurrentEntryType] = useState("");
  const [currentEntryId, setCurrentEntryId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Function to open modal with selected student data
  const handleEditStudent = (studentId) => {
    const student = students.find((s) => s._id === studentId);
    setSelectedStudent(student);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleSaveStudent = async (updatedStudent) => {
    try {
      const response = await fetch(
        `http://localhost:3001/students/${updatedStudent.rollno}`,
        {
          method: "PUT", // Update request
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedStudent), // Send updated student data in the body
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update student");
      }

      // Extract updated student data from the response
      const updatedData = await response.json();

      // Update the state with the updated students
      const updatedStudents = students.map((s) =>
        s.rollno === updatedStudent.rollno ? updatedData.student : s
      );

      setStudents(updatedStudents); // Update the student list

      setMessage("Student updated successfully!");
      setIsModalOpen(false); // Close the modal after a successful update
    } catch (error) {
      console.log("Error during update:", error);
      setError("Failed to update the student. Please try again.");
    }
  };

  const fetchCoursesCount = async () => {
    try {
      const coursesResponse = await fetch(
        "http://localhost:3001/api/courses/count"
      );
      const coursesData = await coursesResponse.json();
      setNumberOfCourses(coursesData.count);
    } catch (error) {
      console.error("Error fetching course count:", error);
    }
  };

  // Function to fetch students entry
  const fetchStudents = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/students`);
      const data = await response.json();
      setStudents(data.students);
      setNumberOfStudents(data.count);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  //function to fetch teacher entries
  const fetchTeachers = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/teachers`);
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers", error);
    }
  };

  useEffect(() => {
    // Fetch students when the component mounts
    fetchStudents();
    fetchTeachers();
    // Fetch number of teachers
    const fetchTeachersCount = async () => {
      try {
        const teachersResponse = await fetch(
          "http://localhost:3001/api/teachers/count"
        );
        const teachersData = await teachersResponse.json();
        setNumberOfTeachers(teachersData.count);
      } catch (error) {
        console.error("Error fetching teacher count:", error);
      }
    };

    fetchTeachersCount();

    fetchCoursesCount();
  }, []);

  //All the deletion process code

  const handleDeleteStudent = (studentId) => {
    setCurrentEntryType("student");
    setCurrentEntryId(studentId);
    setShowModal(true);
  };

  const handleDeleteTeacher = (teacherId) => {
    setCurrentEntryType("teacher");
    setCurrentEntryId(teacherId);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentEntryId(null);
    setCurrentEntryType("");
  };

  const handleConfirm = () => {
    if (currentEntryType === "student") {
      deleteStudent(currentEntryId);
    } else if (currentEntryType === "teacher") {
      deleteTeacher(currentEntryId);
    }

    setShowModal(false);
  };
  const deleteStudent = async (studentId) => {
    try {
      if (!studentId) {
        console.error("Student ID is undefined or null");
        return;
      }

      const response = await fetch(
        `http://localhost:3001/api/students/${studentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      // Refetch students from the server after deletion
      fetchStudents();

      console.log(`Student with ID ${studentId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const deleteTeacher = async (teacherId) => {
    try {
      if (!teacherId) {
        console.error("Teacher Id not found");
        return;
      }

      const response = await fetch(
        `http://localhost:3001/api/teachers/${teacherId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete teacher");
      }

      fetchTeachers();
    } catch (error) {
      console.error("Error deleting Teacher: ", error);
    }
  };
  return (
    <div className="flex">
      <div className=" fixed z-10 h-screen w-64 md:block">
        <SideBar />
      </div>

      <div className="flex-grow md:ml-64">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 md:left-[256px] right-0 bg-white shadow-md p-6 z-0">
          <h1 className="text-3xl text-gray-700 font-semibold pl-8 ">
            Admin Dashboard
          </h1>
        </div>
        <div className="flex flex-col justify-center min-h-screen max-h-full pt-24 bg-gray-300 ">
          <div className="m-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl h-fit">
              {/* Number of Students */}
              <div className="bg-white 0 p-6 rounded-lg shadow-lg flex flex-col items-center">
                <h2 className="text-xl font-bold text-gray-800 ">
                  Number of Students
                </h2>
                <p className="text-4xl font-semibold text-blue-600  mt-2">
                  {numberOfStudents !== null ? numberOfStudents : "Loading..."}
                </p>
              </div>

              {/* Number of Teachers */}
              <div className="bg-white 0 p-6 rounded-lg shadow-lg flex flex-col items-center">
                <h2 className="text-xl font-bold text-gray-800 ">
                  Number of Teachers
                </h2>
                <p className="text-4xl font-semibold text-green-600  mt-2">
                  {numberOfTeachers !== null ? numberOfTeachers : "Loading..."}
                </p>
              </div>
              <div className="bg-white 0 p-6 rounded-lg shadow-lg flex flex-col items-center">
                <h2 className="text-xl font-bold text-gray-800 ">
                  Number of Courses
                </h2>
                <p className="text-4xl font-semibold text-yellow-600  mt-2">
                  {numberofCourses !== null ? numberofCourses : "Loading..."}
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Students List
            </h2>
            <table className="min-w-full bg-white p-6 rounded-md shadow-lg border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b border-gray-300 text-left">
                    Name
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 text-left">
                    Roll No.
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {students && students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student._id}>
                      <td className="py-2 px-4 border-b border-gray-300">
                        {student.name}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-300">
                        {student.rollno}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-300">
                        <button
                          className="bg-red-500 text-white py-1 px-3 mx-3 rounded hover:bg-red-600 transition"
                          onClick={() => handleDeleteStudent(student._id)}
                        >
                          Delete
                        </button>
                        <button
                          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
                          onClick={() => handleEditStudent(student._id)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Teachers List
            </h2>
            <table className="min-w-full bg-white p-6 rounded-md shadow-lg border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b border-gray-300 text-left">
                    Name
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 text-left">
                    Mobile No.
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {teachers && teachers.length > 0 ? (
                  teachers.map((teacher) => (
                    <tr key={teacher._id}>
                      <td className="py-2 px-4 border-b border-gray-300">
                        {teacher.teacher_name}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-300">
                        {teacher.mobile}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-300">
                        <button
                          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                          onClick={() => handleDeleteTeacher(teacher._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      No teachers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {isModalOpen && (
              <EditStudentModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                student={selectedStudent}
                onSave={handleSaveStudent}
                error={error}
                message={message}
              />
            )}
          </div>

          <ConfirmationModal
            show={showModal}
            handleClose={handleClose}
            handleConfirm={handleConfirm}
            entryType={currentEntryType}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
