import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import ExpenseModal from "../components/ExpenseModal";


const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      await axios.delete(`/expenses/${id}`);
      setExpenses(expenses.filter((exp) => exp._id !== id));
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  const handleEditClick = (expense) => {
    setSelectedExpense(expense);
    setShowModal(true);
  };

  const handleUpdateExpense = async (updatedExpense) => {
    try {
      const res = await axios.put(`/expenses/${updatedExpense._id}`, updatedExpense);
      const updatedList = expenses.map((exp) =>
        exp._id === updatedExpense._id ? res.data : exp
      );
      setExpenses(updatedList);
      setShowModal(false);
    } catch (err) {
      console.error("Error updating expense:", err);
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
            <li
              key={expense._id}
              className="bg-white rounded shadow p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{expense.title}</p>
                <p>₹{expense.amount} - {expense.category} - {new Date(expense.date).toLocaleDateString()}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEditClick(expense)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(expense._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Edit Modal */}
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

export default ExpenseList;
