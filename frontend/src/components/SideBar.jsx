import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/aiktc-logo.png'; // Update the path to your logo
import { FaBars } from 'react-icons/fa'; // FontAwesome icon for menu

const SideBar = () => {
    const [isOpen, setIsOpen] = useState(false); // State to control sidebar visibility on mobile
    const location = useLocation(); // Get the current location (path)

    // Determine if a link is active based on the current path
    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile Menu Button */}
            <div className='md:hidden flex justify-between items-center p-4 text-white'>
                <button onClick={() => setIsOpen(!isOpen)} className='mt-24'>
                    <FaBars size={24} />
                </button>
            </div>

            {/* Sidebar */}
            <div className={`fixed h-full bg-gradient-to-r from-violet-600 to-indigo-600 text-gray-400 border-solid border-r-2 border-gray-400 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative`}>
                <div className='flex pt-2 justify-center border-b-2'>
                    <img src={logo} alt='Logo' width={'48px'} className='mb-4 md:mb-7' />
                    <h1 className='text-xl text-white font-bold pt-3'>Admin Panel</h1>
                </div>
                <div className='p-6'>
                    <nav>
                        <ul>
                            <li className='mb-4'>
                                <Link
                                    to="/admin"
                                    className={`text-lg p-2 block rounded ${isActive('/admin') ? 'bg-white text-gray-900 border-2 border-white' : 'text-gray-300 hover:bg-gray-700'}`}
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li className='mb-4'>
                                <Link
                                    to="/admin/createCourse"
                                    className={`text-lg p-2 block rounded ${isActive('/admin/createCourse') ? 'bg-white text-gray-900 border-2 border-white' : 'text-gray-300 hover:bg-gray-700'}`}
                                >
                                    Create Course
                                </Link>
                            </li>
                            <li className='mb-4'>
                                <Link
                                    to="/admin/createStudent"
                                    className={`text-lg p-2 block rounded ${isActive('/admin/createStudent') ? 'bg-white text-gray-900 border-2 border-white' : 'text-gray-300 hover:bg-gray-700'}`}
                                >
                                    Create Student
                                </Link>
                            </li>
                            <li className='mb-4'>
                                <Link
                                    to="/admin/createTeacher"
                                    className={`text-lg p-2 block rounded ${isActive('/admin/createTeacher') ? 'bg-white text-gray-900 border-2 border-white' : 'text-gray-300 hover:bg-gray-700'}`}
                                >
                                    Create Teacher
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default SideBar;
