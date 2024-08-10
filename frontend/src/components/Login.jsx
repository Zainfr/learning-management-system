import React, { useState } from 'react';

const Login = () => {
    const [role, setRole] = useState('');

    return (
        <div className='flex justify-center items-center h-screen bg-gray-100'>
            <div className='p-8 bg-white shadow-md rounded-lg'>
                <h2 className='text-2xl font-bold mb-4'>Login</h2>
                <form>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className='block w-full p-2 mb-4 border rounded bg-gray-50 text-gray-700'
                    >
                        <option value='' disabled>Select your role</option>
                        <option value='admin'>Admin</option>
                        <option value='student'>Student</option>
                        <option value='teacher'>Teacher</option>
                    </select>
                    <input type='text' placeholder='Username' className='block w-full p-2 mb-4 border rounded' />
                    <input type='password' placeholder='Password' className='block w-full p-2 mb-4 border rounded' />
                    <button className='w-full p-2 bg-blue-600 text-white rounded'>Sign In</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
