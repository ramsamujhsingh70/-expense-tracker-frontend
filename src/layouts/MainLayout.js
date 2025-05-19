// src/layouts/MainLayout.js
import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const MainLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-6 min-h-screen">
        <Header />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
