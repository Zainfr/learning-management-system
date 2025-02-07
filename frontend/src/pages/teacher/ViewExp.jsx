import { useState, useEffect } from "react";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom"; // You can use this to navigate to a detailed view if needed
import TeacherSidebar from "../../components/TeacherSidebar";

const ViewExp = () => {
  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState({});
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [numberOfStudents, setNumberOfStudents] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchStudents = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/students`);
      const data = await response.json();
      setStudents(data.students);
      setFilteredStudents(data.students);
      setNumberOfStudents(data.count);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/teacher/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTeacher(data.teacher);
        console.log(teacher);
      } catch (error) {
        console.error("Error fetching Teachers:", error);
        setError("Failed to fetch Teachers. Please try again later.");
      }
    };

    fetchTeacher();
    fetchStudents(); // Fetch the students when the component is mounted
  }, []);

  const handleClick = (rollno) => {
    navigate(`/teacher/${id}/experiment/${rollno}`);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="sticky top-0 left-0 right-0 z-20">
        <Header user="Teacher" />
      </div>
      <div className="flex flex-1 h-[calc(100vh-60px)] w-full overflow-hidden">
        {/* Sidebar - Collapsible on Mobile */}
        <div
          className={`h-full bg-blue-800 transition-all duration-300 ${
            isSidebarOpen ? "w-64" : "w-16"
          }`}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white p-2 block md:hidden"
          >
            {isSidebarOpen ? "❌" : "☰"}
          </button>
          <TeacherSidebar
            userName={teacher?.teacher_name}
            rollNo={teacher?.email}
          />
        </div>
        <div className="flex-1 bg-gray-50 p-10 overflow-auto">
          <h2 className="text-2xl font-semibold mb-4">
            List of Students ({numberOfStudents})
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <div
                  key={index}
                  onClick={() => handleClick(student.rollno)}
                  className="bg-gray-200 p-4 rounded-lg shadow-md hover:bg-gray-300 cursor-pointer transition-all"
                >
                  <h3 className="text-lg font-bold text-center">
                    {student.rollno}
                  </h3>
                  <p className="text-sm text-center">View experiments</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No students found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewExp;
