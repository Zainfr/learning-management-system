import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import TeacherSidebar from "../../components/TeacherSidebar";
import { Check, X, UserCheck, Search, Calendar, ChevronDown, Filter } from "lucide-react";
import toast from "react-hot-toast";

const Attendance = () => {
    const [teacher, setTeacher] = useState({});
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [absentStudents, setAbsentStudents] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [lectures, setLectures] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const department = "CO";
    const [batchs, setBatches] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentDate] = useState(new Date().toLocaleDateString());
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [selectedSubjectID, setSelectedSubjectID] = useState(null);
    const [subjects, setSubjects] = useState([]);

    const fetchSemesters = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/semesters");
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                const formattedSemesters = data.map(sem => ({
                    value: sem._id,
                    label: `Semester ${sem.semesterNo}`
                }));
                setSemesters(formattedSemesters);
                setSelectedSemester(formattedSemesters[0].value);
            }
        } catch (error) {
            console.error("Error fetching semesters", error);
            throw error;
        }
    };

    const fetchBatches = async (semesterId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/lms/get-batches/${department}/${semesterId}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                const formattedBatches = data.map(batch => ({
                    value: batch._id,
                    label: `Batch ${batch.batchNo}`
                }));
                setBatches(formattedBatches);

                if (formattedBatches.length > 0) {
                    setSelectedBatch(formattedBatches[0]);
                }
            }
        } catch (error) {
            console.error("Error fetching batches:", error);
            console.error("Failed to fetch batches. Please try again later.");
        }
    };

    const fetchLeactures = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/lms/get-lectures`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            console.log(data);
            if (data && data.lectures) {
                const formattedLectures = data.lectures.map(lecture => ({
                    value: lecture._id,
                    label: `${lecture.lecture_name} (${lecture.lecture_type})`,
                }));
                setLectures(formattedLectures);
                if (formattedLectures.length > 0) {
                    setSelectedLecture(formattedLectures[0]);
                }
            }
        } catch (error) {
            console.error("Error fetching lectures:", error);
            console.error("Failed to fetch lectures. Please try again later.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [teacherResponse, studentsResponse] = await Promise.all([
                    fetch(`http://localhost:3001/api/teacher/${id}`),
                    fetch(`http://localhost:3001/api/students`)
                ]);

                if (!teacherResponse.ok || !studentsResponse.ok) {
                    throw new Error(`HTTP error!`);
                }

                const teacherData = await teacherResponse.json();
                const studentsData = await studentsResponse.json();

                setTeacher(teacherData.teacher);
                setSubjects(teacherData?.teacher?.subjects);
                setStudents(studentsData.students);
                setFilteredStudents(studentsData.students);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        fetchLeactures();
        fetchSemesters();
    }, [id]);

    useEffect(() => {
        if (selectedSemester) {
            fetchBatches(selectedSemester);
        }
        console.log(selectedSubjectID)
    }, [selectedSemester]);


    useEffect(() => {
        // Filter students based on search query
        const filtered = students.filter(student =>
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.rollno.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredStudents(filtered);
    }, [searchQuery, students]);

    const toggleAbsent = (rollno) => {
        console.log("Toggling absent for rollno:", rollno);
        setAbsentStudents((prev) =>
            prev.includes(rollno)
                ? prev.filter((id) => id !== rollno)
                : [...prev, rollno]
        );
    };

    const markAllPresent = () => {
        setAbsentStudents([]);
    };

    const markAllAbsent = () => {
        const allRollNumbers = students.map(student => student.rollno);
        setAbsentStudents(allRollNumbers);
    };

    const handleSubmit = () => {
        setShowConfirmation(true);
    };

    const confirmSubmit = async () => {
        try {
            const attendanceData = {
                lectureId: selectedLecture?.value, // ID of the selected lecture
                absentRollnos: absentStudents, // List of absent students' roll numbers
                subjectId: selectedSubjectID,
                markedBy: teacher?._id, // ID of the teacher marking attendance
            };

            const response = await fetch('http://localhost:3001/api/mark-attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(attendanceData),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message || "Attendance marked successfully!");
                setShowConfirmation(false);

                // Optional: Reset state or navigate to another page
                setAbsentStudents([]);
            } else {
                toast.error(result.message || "Failed to mark attendance. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting attendance:", error);
            toast.error("An error occurred while submitting attendance. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex flex-col">
                <Header user="Teacher" />
                <div className="flex flex-1 h-[calc(100vh-60px)] w-full">
                    <div className={`h-full bg-blue-800 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"}`}>
                        <TeacherSidebar userName={""} rollno={""} />
                    </div>
                    <div className="flex-1 bg-gray-50 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading attendance data...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <div className="sticky top-0 left-0 right-0 z-20">
                <Header user="Teacher" />
            </div>
            <div className="flex flex-1 h-[calc(100vh-60px)] w-full overflow-hidden">
                <div className={`h-full bg-blue-800 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"}`}>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-white p-2 block md:hidden"
                    >
                        {isSidebarOpen ? <X size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <TeacherSidebar
                        userName={teacher?.teacher_name}
                        rollno={teacher?.email}
                    />
                </div>

                <div className="flex-1 p-6 overflow-auto">
                    <div className="max-w-5xl mx-auto">
                        {/* Page Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">Attendance Management</h1>
                            <div className="flex items-center mt-2 text-gray-600">
                                <Calendar size={16} className="mr-2" />
                                <span>{currentDate}</span>
                                <span className="mx-2">•</span>
                                <span className="font-medium text-blue-600">{teacher?.teacher_name}</span>
                            </div>
                        </div>

                        {/* Controls & Filters */}
                        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex flex-col md:flex-row items-center space-x-4">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="relative w-40 mr-8">
                                            <select
                                                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                                                value={selectedLecture?.label || ""}
                                                onChange={(e) => {
                                                    const selectedLabel = e.target.value;
                                                    const SelectedLectureObj = lectures.find(batch => batch.label === selectedLabel);
                                                    if (SelectedLectureObj) {
                                                        setSelectedLecture(SelectedLectureObj);
                                                    }
                                                }}
                                            >
                                                {lectures.map(batch => (
                                                    <option key={batch.value} value={batch.label}>
                                                        {batch.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                <ChevronDown size={16} className="text-gray-400" />
                                            </div>
                                        </div>
                                        <div className="relative w-40">
                                            <select
                                                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                                                value={selectedSubjectID || ""}
                                                onChange={(e) => {
                                                    const selectedId = e.target.value;
                                                    setSelectedSubjectID(selectedId);
                                                }}
                                            >
                                                {subjects.map(batch => (
                                                    <option key={batch.name} value={batch._id}>
                                                        {batch.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                <ChevronDown size={16} className="text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative w-full md:w-72">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search by name or roll number"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Attendance Card */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">Mark Attendance</h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Total Students: {students.length} | Present: {students.length - absentStudents.length} | Absent: {absentStudents.length}
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={markAllPresent}
                                            className="flex items-center text-sm px-3 py-1.5 border border-green-500 text-green-600 rounded-md hover:bg-green-50"
                                        >
                                            <Check size={16} className="mr-1" />
                                            Mark All Present
                                        </button>
                                        <button
                                            onClick={markAllAbsent}
                                            className="flex items-center text-sm px-3 py-1.5 border border-red-500 text-red-600 rounded-md hover:bg-red-50"
                                        >
                                            <X size={16} className="mr-1" />
                                            Mark All Absent
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Roll No
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Student Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Mark Absent
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredStudents.length > 0 ? (
                                            filteredStudents.map((student, index) => {
                                                const isAbsent = absentStudents.includes(student.rollno);
                                                return (
                                                    <tr key={student.rollno} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {student.rollno}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                            {student.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isAbsent ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                                {isAbsent ? 'Absent' : 'Present'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isAbsent}
                                                                    onChange={() => toggleAbsent(student.rollno)}
                                                                    className="sr-only peer"
                                                                />
                                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                                            </label>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                    No students found matching your search criteria.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                                <button
                                    onClick={handleSubmit}
                                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
                                >
                                    <UserCheck size={18} className="mr-2" />
                                    Submit Attendance
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Confirm Attendance Submission</h3>
                        <p className="text-gray-600 mb-5">
                            You are about to mark {absentStudents.length} students as absent and {students.length - absentStudents.length} students as present. This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Confirm Submission
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance;