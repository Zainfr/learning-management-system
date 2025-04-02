import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import StudentSidebar from "../../components/StudentSidebar";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FileText,
  User,
  Search,
} from "lucide-react";

const ViewStudyMaterial = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [expandedTeacher, setExpandedTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openFolders, setOpenFolders] = useState({});
  const { id } = useParams();
  const [student, setStudent] = useState({});

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/teachers");
        if (!response.ok) throw new Error("Failed to fetch teachers");
        const data = await response.json();
        setTeachers(data);
        console.log("Teachers:", data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
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
      } catch (error) {
        console.error("Error fetching Student:", error);
      }
      console.log(student);
    };
    fetchStudent();
    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.teacher_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFolder = (subjectName) => {
    setOpenFolders((prev) => ({
      ...prev,
      [subjectName]: !prev[subjectName],
    }));
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="sticky top-0 left-0 right-0 z-20">
        <Header user="Student" />
      </div>

      <div className="flex flex-1 h-[calc(100vh-60px)] w-full overflow-hidden">
        <div
          className={`h-full bg-blue-800 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"
            }`}
        >
          <StudentSidebar userName={student?.name} rollNo={student?.rollno} />
        </div>
      </div>
      <div className=" bg-gray-100 ml-64 p-8 h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Folder className="text-blue-600 w-6 h-6" />
            <h1 className="text-2xl font-bold text-gray-800">
              Study Materials
            </h1>
          </div>
          <div className="relative">
            <input
              type="search"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Teacher List */}
        <div className="space-y-4">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher._id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-lg"
            >
              {/* Teacher Card */}
              <button
                onClick={() =>
                  setExpandedTeacher(
                    expandedTeacher === teacher._id ? null : teacher._id
                  )
                }
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-lg font-medium text-gray-700">
                    {teacher.teacher_name}
                  </span>
                </div>
                <div className="transform transition-transform duration-200">
                  {expandedTeacher === teacher._id ? (
                    <ChevronDown className="h-5 w-5 text-blue-600" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Study Materials */}
              {expandedTeacher === teacher._id && (
                <div className="p-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    Email: {teacher.email}
                  </p>
                  <div className="mt-2">
                    <h2 className="text-md font-semibold text-gray-700">
                      Study Materials
                    </h2>
                    {teacher.study_material.map((material) => (
                      <div
                        key={material._id}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                      >
                        <div className="p-6">
                          {/* Folder Name */}
                          <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleFolder(material.subject_name)}
                          >
                            <div className="flex items-center space-x-3">
                              <Folder className="text-blue-500 w-5 h-5" />
                              <h3 className="text-lg font-semibold text-gray-800">
                                {material.subject_name}
                              </h3>
                            </div>
                            {openFolders[material.subject_name] ? (
                              <ChevronDown className="text-gray-500 w-5 h-5" />
                            ) : (
                              <ChevronRight className="text-gray-500 w-5 h-5" />
                            )}
                          </div>

                          {/* Files */}
                          {openFolders[material.subject_name] && (
                            <div className="mt-4 space-y-2">
                              <ul className="list-disc list-inside text-gray-600">
                                <li>
                                  <a
                                    href={`http://localhost:3001${material.filePath}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    <FileText className="mr-2 w-5 h-5" />
                                    {material.filePath.split("/").pop()}
                                  </a>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewStudyMaterial;
