import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/aiktc-logo.png";
import StudentProfile from "../pages/student/StudentProfile";

const Header = ({ user }) => {
  return (
    <>
      <div className="flex bg-white  items-center justify-center shadow-lg">
        <div>
          <img
            src={logo}
            alt="logo"
            width={60}
            className="absolute left-0 top-0 p-2"
          />
        </div>
        <div className="flex items-center h-16">
          <h1 className="text-gray-600 font-bold text-4xl">{user}</h1>
        </div>
      </div>
    </>
  );
};

export default Header;
