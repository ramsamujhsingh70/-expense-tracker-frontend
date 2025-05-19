import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#AA336A", "#3366AA", "#33AA99", "#9933AA"
];

const Reports = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [filter, setFilter] = useState({
    category: "All",
    startDate: "",
    endDate: "",
  });

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("/expenses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setExpenses(res.data);
      setFilteredExpenses(res.data);
      processChartData(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    }
  };

  const processChartData = (data) => {
    const categories = {};
    data.forEach((exp) => {
      categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
    });
    const chartData = Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }));
    setCategoryData(chartData);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    let filtered = [...expenses];

    if (filter.category !== "All") {
      filtered = filtered.filter((e) => e.category === filter.category);
    }
    if (filter.startDate) {
      filtered = filtered.filter((e) => new Date(e.date) >= new Date(filter.startDate));
    }
    if (filter.endDate) {
      filtered = filtered.filter((e) => new Date(e.date) <= new Date(filter.endDate));
    }

    setFilteredExpenses(filtered);
    processChartData(filtered);
  }, [filter, expenses]);

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const exportCSV = () => {
    const headers = ["Title", "Amount", "Category", "Date"];
    const rows = filteredExpenses.map((exp) => [
      exp.title,
      exp.amount,
      exp.category,
      exp.date ? new Date(exp.date).toLocaleDateString() : "",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," +
      [headers, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "expenses_report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uniqueCategories = ["All", ...new Set(expenses.map(e => e.category))];

  return (
    <div className="p-6 md:ml-64 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen transition-all">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-3xl font-bold">
          Expense Reports <span className="text-lg font-medium"> (Total ₹{totalAmount})</span>
        </h2>
        <button
          onClick={exportCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition"
        >
          📤 Export to CSV
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-gray-800 p-5 rounded shadow mb-8">
        <div>
          <label className="block mb-1 text-sm font-medium">Category</label>
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            {uniqueCategories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={filter.startDate}
            onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">End Date</label>
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-center">Category Pie Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-center">Category Bar Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={categoryData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Expense Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 uppercase text-xs">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500 dark:text-gray-400">
                    No expenses found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="p-3 border-t">{exp.title}</td>
                    <td className="p-3 border-t">₹{exp.amount}</td>
                    <td className="p-3 border-t">{exp.category}</td>
                    <td className="p-3 border-t">
                      {exp.date ? new Date(exp.date).toLocaleDateString() : ""}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
