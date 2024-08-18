import React from 'react';
import SideBar from '../../components/SideBar';
import { useState } from 'react';
import { useEffect } from 'react';

const AdminDashboard = () => {
    // Data
    const [numberOfStudents, setNumberOfStudents] = useState(null);
    const [numberOfTeachers, setNumberOfTeachers] = useState(null);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch number of students
                const studentsResponse = await fetch('http://localhost:3001/api/students/count');
                const studentsData = await studentsResponse.json();
                setNumberOfStudents(studentsData.count);

                // Fetch number of teachers
                const teachersResponse = await fetch('http://localhost:3001/api/teachers/count');
                const teachersData = await teachersResponse.json();
                setNumberOfTeachers(teachersData.count);

                // Fetch list of courses
                const coursesResponse = await fetch('http://localhost:3001/api/courses');
                const coursesData = await coursesResponse.json();
                setCourses(coursesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='flex'>
            <SideBar />
            <div className='flex-grow'>
                <div className='ml-64 p-6 border-solid border-b-2 border-gray-200'>
                    <h1 className='text-3xl text-gray-700 font-semibold'>Admin Dashboard</h1>
                </div>
                <div className='flex justify-center h-screen pt-24 bg-gray-300'>
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

                        {/* List of Courses */}
                        <div className='bg-white p-6 rounded-lg shadow-lg'>
                            <h2 className='text-xl font-bold text-gray-800 mb-4'>Courses</h2>
                            <ul className='list-disc pl-5'>
                                {courses.length > 0 ? (
                                    courses.map((course, index) => (
                                        <li key={index} className='text-gray-700'>{course.title}</li>
                                    ))
                                ) : (
                                    <li className='text-gray-700'>Loading...</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
