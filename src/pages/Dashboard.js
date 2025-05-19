import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { format } from 'date-fns';
import ExpenseModal from '../components/ExpenseModal';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [categorySummary, setCategorySummary] = useState({});
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get('/expenses', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      setExpenses(data);

      const totalAmount = data.reduce((acc, curr) => acc + Number(curr.amount), 0);
      setTotal(totalAmount);

      const categoryData = {};
      data.forEach((expense) => {
        if (!categoryData[expense.category]) {
          categoryData[expense.category] = 0;
        }
        categoryData[expense.category] += Number(expense.amount);
      });
      setCategorySummary(categoryData);
    } catch (error) {
      console.error('❌ Failed to fetch expenses:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized. Please login again.");
      return;
    }

    const payload = {
      ...form,
      amount: Number(form.amount),
    };

    try {
      const res = await axios.post("/expenses", payload, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});


      console.log("✅ Expense added:", res.data);
      setForm({ title: '', amount: '', category: '', date: '' });
      fetchData(); // Reload all expenses
    } catch (error) {
      console.error("🚫 Add expense failed:", error.response?.data || error.message);
      alert("Failed to add expense. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      alert("Failed to delete expense.");
    }
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setShowModal(true);
  };

  const handleUpdateExpense = async (updated) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`/expenses/${updated._id}`, updated, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedList = expenses.map((exp) =>
        exp._id === updated._id ? res.data : exp
      );
      setExpenses(updatedList);
      setShowModal(false);
    } catch (err) {
      alert("Failed to update expense.");
    }
  };

  return (
    <div className="p-6 md:ml-64 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Dashboard</h2>

      {/* Add Expense */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Add New Expense</h3>
        <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            className="p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            className="p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
            value={form.amount}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            className="p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
            value={form.category}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            className="p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
            value={form.date}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded col-span-1 md:col-span-4 hover:bg-blue-700 transition"
          >
            ➕ Add Expense
          </button>
        </form>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Total Spent</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Entries</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{expenses.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Categories</h3>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {Object.keys(categorySummary).length}
          </p>
        </div>
      </div>

      {/* Expense Table */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white">Recent Expenses</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm text-left border border-gray-200 dark:border-gray-600">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Category</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length > 0 ? (
                expenses.slice(-5).reverse().map((expense) => (
                  <tr key={expense._id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="p-3">{expense.title}</td>
                    <td className="p-3">₹{expense.amount}</td>
                    <td className="p-3">{expense.category}</td>
                    <td className="p-3">{format(new Date(expense.date), 'dd-MM-yyyy')}</td>
                    <td className="p-3 flex gap-3 justify-center">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500 dark:text-gray-400">No expenses found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedExpense && (
        <ExpenseModal
          expense={selectedExpense}
          onClose={() => setShowModal(false)}
          onSave={handleUpdateExpense}
        />
      )}
    </div>
  );
};

export default Dashboard;
