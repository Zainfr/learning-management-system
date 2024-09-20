import React from "react";
import { motion } from "framer-motion";

const MessageModal = ({ show, handleClose, title, message, success }) => {
  if (!show) return null; // Don't render anything if 'show' is false

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40"
    >
      {/* Modal backdrop */}
      <div
        onClick={handleClose} // Close modal when clicking outside
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 transition-transform duration-300 ease-out ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full transform transition-all">
          {/* Modal Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={handleClose}
              className="text-gray-600 hover:text-gray-900 text-lg font-bold focus:outline-none"
            >
              &times;
            </button>
          </div>

          {/* Modal Body */}
          <div className="mt-4">
            <p className="text-gray-700">{message}</p>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleClose}
              className={`px-4 py-2 rounded ${
                success
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              } text-white`}
            >
              {success ? "Okay" : "Close"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageModal;
