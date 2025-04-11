import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TeacherSidebar from "../../components/TeacherSidebar";
import Header from "../../components/Header";
import { Clock, FileText, ExternalLink, Download, ChevronDown, ChevronRight } from 'lucide-react';

const ViewExperiments = () => {
    const [experiments, setExperiments] = useState([]);
    const [error, setError] = useState(null);
    const [teacher, setTeacher] = useState({});
    const [student, setStudent] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [expandedSubjects, setExpandedSubjects] = useState({});
    const { id, rollno } = useParams();

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/student/rollno/${rollno}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setStudent(data);
                console.log(data);
            } catch (error) {
                console.error("Error fetching Student:", error);
                setError("Failed to fetch student. Please try again later.");
            }
        };
        const fetchTeacher = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/teacher/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTeacher(data.teacher);
            } catch (error) {
                console.error("Error fetching Teacher:", error);
                setError("Failed to fetch teacher. Please try again later.");
            }
        };

        const fetchExperiments = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/drive/kamchalu/${rollno}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                // Group experiments by subject
                const experimentsBySubject = {};
                (data.experiments || []).forEach(exp => {
                    if (!experimentsBySubject[exp.subject_name]) {
                        experimentsBySubject[exp.subject_name] = [];
                        // Initialize expanded state for this subject
                        setExpandedSubjects(prev => ({
                            ...prev,
                            [exp.subject_name]: true
                        }));
                    }
                    experimentsBySubject[exp.subject_name].push(exp);
                });

                setExperiments(experimentsBySubject);
                console.log(data.experiments);
            } catch (error) {
                console.error("Error fetching Experiments:", error);
                setError("Failed to fetch experiments. Please try again later.");
            }
        };

        fetchStudent();

        fetchTeacher();
        fetchExperiments();
    }, [rollno]);

    const toggleSubject = (subject) => {
        setExpandedSubjects({
            ...expandedSubjects,
            [subject]: !expandedSubjects[subject]
        });
    };

    const handleFileView = (filePath) => {
        window.open(`http://localhost:3001${filePath}`, '_blank');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    };

    if (error) {
        return <div className="text-center text-red-500 mt-4">{error}</div>;
    }

    const hasExperiments = Object.keys(experiments).length > 0;

    return (
        <div className="h-screen flex flex-col">
            <div className="sticky top-0 left-0 right-0 z-20">
                <Header user="Teacher" />
            </div>
            <div className="flex flex-1 h-[calc(100vh-60px)] w-full overflow-hidden">
                {/* Sidebar - Collapsible on Mobile */}
                <div
                    className={`h-full bg-blue-800 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"
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

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="p-6 max-w-6xl mx-auto">
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Experiments Uploaded by {student?.name || "Student"}</h1>
                            <p className="text-gray-600">Browse uploaded experiments by subject</p>
                        </header>

                        {!hasExperiments ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                                <p className="text-lg font-medium text-gray-700">
                                    No experiments uploaded yet.
                                </p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                {Object.keys(experiments).map((subject) => (
                                    <div key={subject} className="border-b border-gray-200 last:border-b-0">
                                        <div
                                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                            onClick={() => toggleSubject(subject)}
                                        >
                                            <div className="flex items-center">
                                                {expandedSubjects[subject] ? (
                                                    <ChevronDown className="h-5 w-5 text-gray-500 mr-2" />
                                                ) : (
                                                    <ChevronRight className="h-5 w-5 text-gray-500 mr-2" />
                                                )}
                                                <h2 className="text-lg font-medium text-gray-800">{subject}</h2>
                                                <span className="ml-3 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-sm">
                                                    {experiments[subject].length}
                                                </span>
                                            </div>
                                        </div>

                                        {expandedSubjects[subject] && (
                                            <div className="px-4 pb-4">
                                                {experiments[subject].map((experiment) => (
                                                    <div
                                                        key={experiment._id}
                                                        className="mb-3 last:mb-0 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors p-4 hover:bg-blue-50"
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <h3 className="text-lg font-medium text-gray-800 mb-1">
                                                                    {experiment.fileName || "Experiment File"}
                                                                </h3>
                                                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                                                    <FileText className="h-4 w-4 mr-1" />
                                                                    <span className="font-mono">{experiment.filePath.split('/').pop()}</span>
                                                                </div>
                                                                {experiment.uploadedAt && (
                                                                    <div className="flex items-center text-sm text-gray-500">
                                                                        <Clock className="h-4 w-4 mr-1" />
                                                                        <span>{formatDate(experiment.uploadedAt)}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex">
                                                                <button
                                                                    onClick={() => handleFileView(experiment.filePath)}
                                                                    className="flex items-center justify-center text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-100 transition-colors gap-1"
                                                                >
                                                                    <ExternalLink className="h-5 w-5" />
                                                                    <span>View</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => window.open(`http://localhost:3001${experiment.filePath}`, '_blank')}
                                                                    className="flex items-center justify-center text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-100 transition-colors gap-1 ml-2"
                                                                >
                                                                    <Download className="h-5 w-5" />
                                                                    <span>Download</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewExperiments;