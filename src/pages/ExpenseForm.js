import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const ExpenseForm = ({ editingExpense, onSaveComplete }) => {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: '',
    date: ''
  });

  useEffect(() => {
    if (editingExpense) {
      setForm(editingExpense);
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await axios.put(`/expenses/${editingExpense._id}`, form);
        alert('✅ Expense updated');
      } else {
        await axios.post('/expenses', form);
        alert('✅ Expense added');
      }
      setForm({ title: '', amount: '', category: '', date: '' });
      onSaveComplete(); // Notify parent to reload
    } catch (err) {
      console.error(err);
      alert('❌ Failed to save expense');
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">{editingExpense ? 'Edit' : 'Add'} Expense</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
        <input name="amount" value={form.amount} onChange={handleChange} type="number" placeholder="Amount" required />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" required />
        <input name="date" value={form.date} onChange={handleChange} type="date" placeholder="Date" required />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          {editingExpense ? 'Update' : 'Add'} Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
