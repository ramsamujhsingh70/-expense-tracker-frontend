import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://expense-tracker-backend-8csc.onrender.com', // 👈 use this for local development
});

export default instance;
