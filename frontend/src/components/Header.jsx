import React from "react";
import logo from "../assets/aiktc-logo.png";

const Header = ({ user }) => {
  return (
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
      <button className="absolute right-2 top-2 px-4 py-2.5 transition-all duration-300 ease-in-out hover:bg-red-700 bg-red-500 font-bold text-white rounded-lg">
        Log out
      </button>
    </div>
  );
};

export default Header;
