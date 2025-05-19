import React, { useState, useEffect } from "react";

const ExpenseModal = ({ expense, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  useEffect(() => {
    if (expense) {
      setForm({
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: expense.date.slice(0, 10),
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...expense, ...form });
  };

  if (!expense) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Expense</h2>
        <form onSubmit={handleSubmit}>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border mb-2" required />
          <input name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" type="number" className="w-full p-2 border mb-2" required />
          <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full p-2 border mb-2" required />
          <input name="date" value={form.date} onChange={handleChange} type="date" className="w-full p-2 border mb-4" required />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
