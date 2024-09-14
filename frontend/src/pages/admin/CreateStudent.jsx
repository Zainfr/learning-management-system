import React, { useState, useEffect } from 'react';
import SideBar from '../../components/SideBar';
import MessageModal from '../../components/MessageModal';

const CreateStudent = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalConent, setModalContent] = useState({
        title: '',
        message: '',
        success: true,
    })
    const handleClose = () => setShowModal(false);
    const [error, setError] = useState(null);
    const [semesters, setSemesters] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        rollno: '',
        mobile: '',
        sem: '',
        mentor: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/semesters');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setSemesters(data);
                } else {
                    throw new Error('Unexpected response format');
                }
            } catch (error) {
                console.error('Error fetching semesters:', error);
                setError('Failed to fetch semesters. Please try again later.');
            }
        };

        fetchSemesters();

        const fetchTeachers = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/teachers');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setTeachers(data);
                } else {
                    throw new Error('Unexpected response format');
                }
            } catch (error) {
                console.error('Error fetching Teachers:', error);
                setError('Failed to fetch Teachers. Please try again later.');
            }
        }

        fetchTeachers();
    }, []);

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

        const formDataForUpload = new FormData();
        formDataForUpload.append('file', file);

        setUploading(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost:3001/importUser', {
                method: 'POST',
                body: formDataForUpload,
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
        console.log(formData);
        try {
            const response = await fetch('http://localhost:3001/form-submit', {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                setModalContent({
                    title: 'Error',
                    message: `Failed to create Student 😨 `,
                    success: false
                })
                throw new Error(`HTTP error! Status: ${response.status}`);

            } else {
                setModalContent({
                    title: "Success.",
                    message: "Student created successfully 😁!!",
                    success: true,
                })
            }

            const data = await response.json();
            console.log('Response Data:', data);
            console.log('Form Data:', formData);
            setMessage('Student created successfully!');
        } catch (error) {
            console.log('Form submission error:', error);
            setMessage('Failed to create student. Please try again.');
            setModalContent({
                title: 'Error',
                message: `Failed to create Student 😨 ${error}`,
                success: false
            })
        }
        setShowModal(true);
    };

    return (
        <div className='flex'>
            {/* Fixed Sidebar */}
            <div className=' fixed z-10 h-screen w-64 md:block'>
                <SideBar />
            </div>

            <div className='flex-grow md:ml-64'>

                {/* Fixed Header */}
                <div className='fixed top-0 left-0 md:left-[256px] right-0 bg-white shadow-md p-6 z-0'>
                    <h1 className='text-3xl text-gray-700 font-semibold pl-8'>Create Student</h1>
                </div>

                {/* Form and CSV Upload centered */}
                <div className='flex justify-center items-center h-full pt-24 bg-gray-300'>
                    <div className='bg-white p-6 rounded-lg shadow-md mt-5 mb-5'>
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
                                <label htmlFor='rollno' className='block text-gray-700 mb-2'>Roll No.</label>
                                <input
                                    type='text'
                                    name='rollno'
                                    id='rollno'
                                    value={formData.rollno}
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
                            <div className='mb-4'>
                                <label htmlFor='sem' className='block text-gray-700 mb-2'>Semester</label>
                                <select name='sem' value={formData.sem} onChange={handleChange} required>
                                    <option value=''>Select Semester</option>
                                    {semesters.map((semester) => (
                                        <option key={semester._id} value={semester._id}>
                                            {semester.semester}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='mb-4'>
                                <label htmlFor='mentor' className='block text-gray-700 mb-2'>Mentor</label>
                                <select name="mentor" value={formData.mentor} onChange ={handleChange} required>
                                    <option value="">Select Mentor</option>
                                    {teachers.map((teacher) => (
                                        <option key={teacher._id} value={teacher._id}>
                                            {teacher.teacher_name}
                                        </option>
                                    ))}
                                </select>
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

                            <button type='submit' className='w-full p-2 bg-blue-600 text-white rounded mb-4'>
                                Submit
                            </button>
                            {error && <p className='text-red-500'>{error}</p>}
                            {message && <p className='text-green-500'>{message}</p>}
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
                        <MessageModal
                            show={showModal}
                            handleClose={handleClose}
                            title={modalConent.title}
                            message={modalConent.message}
                            success={modalConent.success}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateStudent;
