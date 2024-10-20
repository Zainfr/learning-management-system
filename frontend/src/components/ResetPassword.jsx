import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract email from URL parameters
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email");
    if (email) {
      setFormData(prevData => ({ ...prevData, email }));
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { email, otp, newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error resetting password.");
      }

      setMessage("Password successfully reset! Redirecting to login...");
      setTimeout(() => navigate("/"), 3000); // Redirect to login page
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleResetPassword} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        {message && <div className="text-green-500 mb-2">{message}</div>}
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="my-6">
          <FloatLabel>
            <InputText
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
          </FloatLabel>
        </div>
        <div className="my-6">
          <FloatLabel>
            <InputText
              id="otp"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
            <label htmlFor="otp" className="block text-gray-700 mb-2">
              Enter OTP
            </label>
          </FloatLabel>
        </div>
        <div className="my-6">
          <FloatLabel>
            <InputText
              id="newPassword"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
            <label htmlFor="newPassword" className="block text-gray-700 mb-2">
              New Password
            </label>
          </FloatLabel>
        </div>
        <div className="my-6">
          <FloatLabel>
            <InputText
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
              Confirm Password
            </label>
          </FloatLabel>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "Resetting Password..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;