import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/auth/forgot-password/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error requesting OTP.");
      }

      setMessage("OTP sent to your email. Please check your inbox.");
      setTimeout(() => navigate("/reset-password"), 3000); // Navigate to reset password page
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        {message && <div className="text-green-500 mb-2">{message}</div>}
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="my-6">
          <FloatLabel>
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Enter your Email
            </label>
          </FloatLabel>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "Sending OTP..." : "Request OTP"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
