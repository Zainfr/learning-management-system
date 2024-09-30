import React, { useState } from "react";

const StudentProfile = ({ onLogout }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleLogoutClick = () => {
    setIsVisible(true);
  };

  const handleConfirmLogout = () => {
    onLogout(); // Call the logout function passed as a prop
    setIsVisible(false);
  };

  const handleCancelLogout = () => {
    setIsVisible(false);
  };
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
        <button onClick={handleLogoutClick}>Log out</button>
        {isVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
              <p>Are you sure you want to log out?</p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleCancelLogout}
                  className="mr-2 bg-gray-300 rounded-lg py-1 px-4"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="bg-red-500 text-white rounded-lg py-1 px-4"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
