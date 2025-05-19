import React, { useState } from 'react';
import axios from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return alert('Passwords do not match');
    }
    try {
      await axios.post(`/auth/reset-password/${token}`, { password });
      alert('Password reset successful!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Reset failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Reset Password</h2>
        <form onSubmit={handleReset}>
          <input
            type={show ? 'text' : 'password'}
            name="password"
            placeholder="New Password"
            className="w-full p-2 mb-4 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type={show ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full p-2 mb-4 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <label className="flex items-center text-sm mb-4">
            <input type="checkbox" onChange={() => setShow(!show)} className="mr-2" />
            Show Password
          </label>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white w-full p-2 rounded"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
