import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/signup", form);
      alert("User registered successfully!");
      navigate("/login");
    } catch (err) {
      alert("Registration failed!");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 via-indigo-100 to-blue-200 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-gray-200">
        <h1 className="text-center text-4xl font-bold text-blue-700 mb-4">📊 TrackIt</h1>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">User Signup</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
          <input
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold transition"
          >
            Register
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-gray-600">
        Created with ❤️ by <span className="font-semibold">Ram Samujh Singh</span>
      </p>
    </div>
  );
};

export default Signup;
