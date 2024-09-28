import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        setError(data.msg);
      } else {
        localStorage.setItem("token", data.token);

        if (data.user.type === "Admin") {
          navigate(`/admin/${data.user.id}`);
        } else if (data.user.type === "Teacher") {
          navigate(`/teacher/${data.user.id}`);
        } else {
          navigate(`/student/${data.user.id}`);
        }
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically update email or password based on the input name
    }));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="my-6">
          <FloatLabel>
            <InputText
              id="email"
              type="email"
              name="email" // Ensure the name is "email"
              value={formData.email}
              onChange={handleChange} // Call handleChange on change
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
              id="password"
              type="password"
              name="password" // Ensure the name is "password"
              value={formData.password}
              onChange={handleChange} // Call handleChange on change
              className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
          </FloatLabel>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
