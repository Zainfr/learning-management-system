import React from 'react';
import SideBar from '../../components/SideBar';

const AdminDashboard = () => {
    return (
        <div className='flex'>
            <SideBar />
            <div className='flex-grow'>
                <div className='ml-64 p-6 border-solid border-b-2 border-gray-200 flex-grow'>
                    <h1 className='text-3xl text-gray-700 font-semibold'>Admin Dashboard</h1>
                </div>
                <div className='flex justify-center items-center h-screen pt-24 bg-gray-300'>
                    screen
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;
