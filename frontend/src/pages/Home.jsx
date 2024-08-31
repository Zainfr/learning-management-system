import React from 'react'
import Login from '../components/Login'
import logo from '../assets/aiktc-logo.png';

const SideDesign = () => {
    return (
        <div className='flex flex-col bg-gradient-to-r from-violet-600 to-indigo-600 h-full justify-center items-center p-6 md:p-0 md:flex-row md:h-full z-10'>
            <div className='text-center md:text-left md:mr-[55vh] md:ml-20'>
                <img src={logo} alt='Logo' width={'120px'} className='mb-4 md:mb-7' />
                <div>
                    <h1 className='font-extrabold text-[2.5rem] md:text-[4rem] text-white'>Edvantage.</h1>
                    <h1 className='font-bold text-[1.5rem] md:text-[3rem] text-white'>Learning</h1>
                    <h1 className='font-bold text-[1.5rem] md:text-[3rem] text-white'>Management</h1>
                    <h1 className='font-bold text-[1.5rem] md:text-[3rem] text-white'>System</h1>
                </div>
            </div>
        </div>
    );
}

const Home = () => {
    return (
        <div className='flex flex-col md:flex-row h-screen'>
            <SideDesign />
            <div className='flex-grow'>
                <Login />
            </div>
        </div>
    );
}


export default Home