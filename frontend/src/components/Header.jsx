import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/aiktc-logo.png";
import StudentProfile from "../pages/student/StudentProfile";

const Header = ({ user }) => {
  const [isProfileVisible, setProfileVisible] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from local storage
    navigate("/"); // Redirect to the login page
  };

  const toggleProfile = () => {
    setProfileVisible(!isProfileVisible);
  };
  return (
    <>
      <div className="flex  items-center justify-center shadow-lg">
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
        <button
          onClick={toggleProfile}
          className="absolute right-2 top-2 px-4 py-2.5 transition-all duration-300 ease-in-out hover:bg-red-700 bg-red-500 font-bold text-white rounded-lg"
        >
          {isProfileVisible ? "Hide Profile" : "Show Profile"}
        </button>
      </div>
      <div className="float-right m-3">
        {isProfileVisible && (
          <StudentProfile onLogout={handleLogout} user={user} />
        )}
      </div>
    </>
  );
};

export default Header;
