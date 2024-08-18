import React, { useState } from 'react';
import SideBar from '../../components/SideBar';
import Papa from 'papaparse';

const CreateStudent = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        mobile: '',
        name: '',
    });

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCSVSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setMessage('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost:3001/api/import-csv', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.msg || 'File uploaded successfully!');
            } else {
                setMessage(data.msg || 'File upload failed.');
            }
        } catch (error) {
            setMessage('An error occurred during file upload.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        try {
            const response = await fetch(`http://localhost:3001/form-submit`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(formData),
            })
            console.log(response);
            console.log('Form Data:', formData);
        } catch (error) {
            console.log("", error);
        }

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
                                <label htmlFor='name' className='block text-gray-700 mb-2'>Name</label>
                                <input
                                    type='text'
                                    name='name'
                                    id='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    className='w-full p-2 border rounded'
                                    required
                                />
                            </div>
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
                                <label htmlFor='mobile' className='block text-gray-700 mb-2'>Mobile Number</label>
                                <input
                                    type='tel'
                                    name='mobile'
                                    id='mobile'
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className='w-full p-2 border rounded'
                                    required
                                />
                            </div>
                            <button type='submit' className='w-full p-2 bg-blue-600 text-white rounded mb-4'>
                                Submit
                            </button>
                        </form>

                        <div className='p-6'>
                            <h1 className='text-2xl font-semibold mb-4'>Upload CSV</h1>
                            <form onSubmit={handleCSVSubmit} encType='multipart/form-data'>
                                <div className='mb-4'>
                                    <input
                                        type='file'
                                        accept='.csv'
                                        onChange={handleFileChange}
                                        className='border border-gray-300 rounded p-2'
                                    />
                                </div>
                                <button
                                    type='submit'
                                    disabled={uploading}
                                    className='bg-blue-500 text-white p-2 rounded disabled:opacity-50'
                                >
                                    {uploading ? 'Uploading...' : 'Upload CSV'}
                                </button>
                            </form>
                            {message && <p className='mt-4 text-gray-700'>{message}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateStudent;
