import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar fixed */}
      <Sidebar />

      {/* Main content shifted right by sidebar width */}
      <main className="ml-64 p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
