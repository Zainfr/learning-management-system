import React, { useState } from 'react';
import SideBar from '../../components/SideBar';
import Papa from 'papaparse';

const CreateStudent = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        phone: '',
    });

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true, // Set to false if CSV doesn't have headers
                dynamicTyping: true,
                complete: (result) => {
                    setData(result.data);
                    setError(null);
                    // Handle CSV data here
                },
                error: (error) => {
                    setError(error.message);
                },
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form Data:', formData);
    };

    return (
        <div className='flex'>
            {/* Fixed Sidebar */}
            <SideBar />
            <div className='flex-grow'>
                {/* Fixed Header */}
                <div className='fixed top-0 left-[256px] right-0 bg-white shadow-md p-6 z-20'>
                    <h1 className='text-3xl text-gray-700 font-semibold'>Create Student</h1>
                </div>

                {/* Form and CSV Upload centered */}
                <div className='flex justify-center items-center h-screen pt-24 bg-gray-300'>
                    <div className='bg-white p-6 rounded-lg shadow-md w-full max-w-lg'>
                        <form onSubmit={handleSubmit}>
                            <div className='mb-4'>
                                <label htmlFor='email' className='block text-gray-700 mb-2'>Email</label>
                                <input
                                    type='email'
                                    name='email'
                                    id='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    className='w-full p-2 border rounded'
                                    required
                                />
                            </div>
                            <div className='mb-4'>
                                <label htmlFor='password' className='block text-gray-700 mb-2'>Password</label>
                                <input
                                    type='password'
                                    name='password'
                                    id='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                    className='w-full p-2 border rounded'
                                    required
                                />
                            </div>
                            <div className='mb-4'>
                                <label htmlFor='phone' className='block text-gray-700 mb-2'>Phone Number</label>
                                <input
                                    type='tel'
                                    name='phone'
                                    id='phone'
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className='w-full p-2 border rounded'
                                    required
                                />
                            </div>
                            <button type='submit' className='w-full p-2 bg-blue-600 text-white rounded mb-4'>
                                Submit
                            </button>
                        </form>

                        <div className='flex flex-col items-center'>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className='mb-4'
                            />
                            {error && <p className='text-red-600 mt-4'>{error}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateStudent;
