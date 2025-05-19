import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileBarChart2,
  LogIn,
  UserPlus,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Reports", icon: <FileBarChart2 size={20} />, path: "/reports" },
    { name: "Login", icon: <LogIn size={20} />, path: "/login" },
    { name: "Signup", icon: <UserPlus size={20} />, path: "/signup" },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-2xl z-40 transition-colors duration-500 flex flex-col">
      <div className="p-6 border-b border-gray-800 dark:border-gray-200 text-center">
        <h1 className="text-3xl font-extrabold tracking-wide">📊 TrackIt</h1>
      </div>

      <nav className="flex flex-col mt-4 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center px-6 py-3 gap-3 font-medium transition-all duration-200 ${
              location.pathname === item.path
                ? "bg-blue-600 dark:bg-blue-200 text-white dark:text-blue-900"
                : "hover:bg-gray-800 hover:dark:bg-gray-100 text-gray-300 dark:text-gray-800"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}

        {/* Toggle Theme */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-3 px-6 py-3 mt-4 text-left transition-all duration-200 hover:bg-gray-800 hover:dark:bg-gray-200 text-gray-300 dark:text-gray-800"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="mt-auto flex items-center px-6 py-3 gap-3 bg-red-600 hover:bg-red-700 w-full text-left transition duration-200 text-white font-semibold"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>

      {/* Animated Glowing Footer */}
      <div className="text-center text-sm text-gray-400 dark:text-gray-600 px-4 py-4 border-t border-gray-700 dark:border-gray-300 animate-glow">
        Created with <span className="text-red-500">❤️</span> by <strong>Ram Samujh Singh</strong>
      </div>
    </aside>
  );
};

export default Sidebar;
