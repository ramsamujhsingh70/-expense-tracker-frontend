// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://expense-tracker-backend-8csc.onrender.com',
});

export default instance;