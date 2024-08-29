import React, { useState } from 'react';
import SideBar from '../../components/SideBar';
import Papa from 'papaparse';

const CreateCourse = () => {
    const [formData, setFormData] = useState({
        title: '',
    });

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
            <div className=' fixed z-10 h-screen w-64 md:block'>
                <SideBar />
            </div>

            <div className='flex-grow md:ml-64'>

                {/* Fixed Header */}
                <div className='fixed top-0 left-0 md:left-[256px] right-0 bg-white shadow-md p-6 z-0'>
                    <h1 className='text-3xl text-gray-700 font-semibold pl-8'>Create Course</h1>
                </div>

                {/* Form and CSV Upload centered */}
                <div className='flex justify-center items-center h-screen pt-24 bg-gray-300'>
                    <div className='bg-white p-6 rounded-lg shadow-md mt-5 mb-5'>
                        <form onSubmit={handleSubmit}>
                            <div className='mb-4'>
                                <label htmlFor='name' className='block text-gray-700 mb-2'>Course Title</label>
                                <input
                                    type='text'
                                    name='title'
                                    id='title'
                                    value={formData.name}
                                    onChange={handleChange}
                                    className='w-full p-2 border rounded'
                                    required
                                />
                            </div>

                            <button type='submit' className='w-full p-2 bg-blue-600 text-white rounded mb-4'>
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;
