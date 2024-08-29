import React, { useState, useEffect } from 'react';
import SideBar from '../../components/SideBar';
import ReactPaginate from 'react-paginate';

const AdminDashboard = () => {
    const [numberOfStudents, setNumberOfStudents] = useState(null);
    const [numberOfTeachers, setNumberOfTeachers] = useState(null);
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Function to fetch students
    const fetchStudents = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/students?page=${currentPage}`);
            const data = await response.json();
            setStudents(data.students);
            setTotalPages(data.totalPages);
            setNumberOfStudents(data.students.length);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    useEffect(() => {
        // Fetch students when the component mounts
        fetchStudents();

        // Fetch number of teachers
        const fetchTeachersCount = async () => {
            try {
                const teachersResponse = await fetch('http://localhost:3001/api/teachers/count');
                const teachersData = await teachersResponse.json();
                setNumberOfTeachers(teachersData.count);
            } catch (error) {
                console.error('Error fetching teacher count:', error);
            }
        };

        fetchTeachersCount();
    }, []);

    const handleDeleteStudent = async (studentId) => {
        try {
            if (!studentId) {
                console.error('Student ID is undefined or null');
                return;
            }

            const response = await fetch(`http://localhost:3001/api/students/${studentId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete student');
            }

            // Refetch students from the server after deletion
            fetchStudents();

            console.log(`Student with ID ${studentId} deleted successfully`);
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };
    return (
        <div className='flex'>
            <div className=' fixed z-10 h-screen w-64 md:block'>
                <SideBar />
            </div>

            <div className='flex-grow md:ml-64'>

                {/* Fixed Header */}
                <div className='fixed top-0 left-0 md:left-[256px] right-0 bg-white shadow-md p-6 z-0'>
                    <h1 className='text-3xl text-gray-700 font-semibold pl-8'>Admin Dashboard</h1>
                </div>
                <div className='flex flex-col justify-center h-screen pt-24 bg-gray-300'>
                    <div className='m-6'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl h-fit'>
                            {/* Number of Students */}
                            <div className='bg-white p-6 rounded-lg shadow-lg flex flex-col items-center'>
                                <h2 className='text-xl font-bold text-gray-800'>Number of Students</h2>
                                <p className='text-4xl font-semibold text-blue-600 mt-2'>
                                    {numberOfStudents !== null ? numberOfStudents : 'Loading...'}
                                </p>
                            </div>

                            {/* Number of Teachers */}
                            <div className='bg-white p-6 rounded-lg shadow-lg flex flex-col items-center'>
                                <h2 className='text-xl font-bold text-gray-800'>Number of Teachers</h2>
                                <p className='text-4xl font-semibold text-green-600 mt-2'>
                                    {numberOfTeachers !== null ? numberOfTeachers : 'Loading...'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='p-6'>
                        <h2 className='text-2xl font-semibold text-gray-700 mb-4'>Students List</h2>
                        <table className='min-w-full bg-white p-6 rounded-md shadow-lg'>
                            <thead>
                                <tr>
                                    <th className='py-2 px-4 border-b'>Name</th>
                                    <th className='py-2 px-4 border-b'>Roll No.</th>
                                    <th className='py-2 px-4 border-b'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student._id}>
                                        <td className='py-2 px-4 border-b'>{student.name}</td>
                                        <td className='py-2 px-4 border-b'>{student.rollno}</td>
                                        <td className='py-2 px-4 border-b'>
                                            <button
                                                className='bg-red-500 text-white py-1 px-3 rounded'
                                                onClick={() => handleDeleteStudent(student._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className='mt-4'>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    className={`py-2 px-4 ${i + 1 === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>



    );
};

export default AdminDashboard;
