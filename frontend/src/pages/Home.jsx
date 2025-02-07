import React from "react";
import Login from "../components/Login";
import logo from "../assets/aiktc-logo.png";

const SideDesign = () => {
  return (
    <div className="flex flex-col bg-gradient-to-r from-blue-800 to-blue-500 h-full justify-center items-center p-6 md:p-0 w-full">
      <div className="text-center md:text-left w-full flex flex-col justify-center items-center md:items-start px-6 md:px-20">
        <img src={logo} alt="Logo" width={"120px"} className="mb-4 md:mb-7" />
        <div className="text-start">
          <h1 className="font-black text-[2.5rem] md:text-[4rem] bg-gradient-to-b from-white to-blue-400 text-transparent bg-clip-text drop-shadow-lg">
            Edvantage.
          </h1>
          <div className="leading-tight md:leading-snug">
            <p className="font-semibold text-[1.3rem] md:text-[2.5rem] text-white">
              Learning
            </p>
            <p className="font-semibold text-[1.3rem] md:text-[2.5rem] text-white">
              Management
            </p>
            <p className="font-semibold text-[1.3rem] md:text-[2.5rem] text-white">
              System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* SideDesign - Top on mobile, Left on larger screens */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex">
        <SideDesign />
      </div>

      {/* Login Section - Bottom on mobile, Right on larger screens */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex justify-center items-center bg-gray-100">
        <Login />
      </div>
    </div>
  );
};

export default Home;
