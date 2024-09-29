import React from "react";

const StudentProfile = () => {
  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg overflow-hidden rounded-2xl p-3">
      <div className="flex flex-col items-center p-6">
        <img
          src="https://via.placeholder.com/100"
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4"
        />
        <h1 className="text-xl font-semibold text-gray-600">Fazil</h1>
        <p className="text-gray-600">22co27@aiktc.ac.in</p>
      </div>

      <div className="hover:bg-slate-300 rounded-2xl p-2">
        <button>Log out</button>
      </div>
    </div>
  );
};

export default StudentProfile;
