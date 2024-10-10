import { useState, useEffect } from "react";
import Header from '../../components/Header';
import { useNavigate, useParams } from "react-router-dom"; // You can use this to navigate to a detailed view if needed

const ViewExp = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [numberOfStudents, setNumberOfStudents] = useState(0);
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
        fetchStudents(); // Fetch the students when the component is mounted
    }, []);

    const handleClick = (rollno) => {
        navigate(`/teacher/${id}/experiment/${rollno}`);
    }

    return (
        <div>
            <Header user="Teacher" />
            <div className="container mx-auto p-4">
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
    );
};

export default ViewExp;
