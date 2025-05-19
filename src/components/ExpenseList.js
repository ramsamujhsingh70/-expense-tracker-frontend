import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import ExpenseModal from "./ExpenseModal";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleEditClick = (expense) => {
    setEditingExpense(expense);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      await axios.delete(`/expenses/${id}`);
      fetchExpenses(); // Refresh list
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete expense.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Expenses</h2>

      {expenses.length === 0 ? (
        <p>No expenses yet.</p>
      ) : (
        <ul className="space-y-3">
          {expenses.map((expense) => (
            <li key={expense._id} className="border p-3 rounded shadow">
              <div className="flex justify-between items-center">
                <div>
                  <strong>{expense.title}</strong> — ₹{expense.amount} ({expense.category})
                  <br />
                  <small>{new Date(expense.date).toLocaleDateString()}</small>
                </div>
                <div className="space-x-2">
                  <button
                    className="bg-yellow-500 px-3 py-1 rounded text-white"
                    onClick={() => handleEditClick(expense)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 px-3 py-1 rounded text-white"
                    onClick={() => handleDelete(expense._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editingExpense && (
        <ExpenseModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          fetchExpenses={fetchExpenses}
        />
      )}
    </div>
  );
};

export default ExpenseList;
