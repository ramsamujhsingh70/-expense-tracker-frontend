import React, { useState } from "react";
import axios from "../api/axios";

const AddExpense = ({ fetchExpenses }) => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Other",
    date: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!form.title || !form.amount || !form.category || !form.date) {
        setError("Please fill all fields.");
        setLoading(false);
        return;
      }

      await axios.post("/expenses", form);
      setForm({ title: "", amount: "", category: "Other", date: "" });

      if (fetchExpenses) fetchExpenses();
    } catch (err) {
      console.error("Failed to add expense details:", err.response || err);
      setError("Failed to add expense. Please try again.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded mb-6">
      <h2 className="text-xl font-semibold mb-4">Add Expense</h2>

      {error && (
        <div className="mb-3 text-red-600 font-semibold" role="alert">
          {error}
        </div>
      )}

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="border p-2 w-full mb-2"
        required
      />

      <input
        name="amount"
        type="number"
        value={form.amount}
        onChange={handleChange}
        placeholder="Amount"
        className="border p-2 w-full mb-2"
        min="0"
        step="0.01"
        required
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        required
      >
        <option value="Other">Other</option>
        <option value="Food">Food</option>
        <option value="Travel">Travel</option>
        <option value="Health">Health</option>
        <option value="Education">Education</option>
        <option value="Clothing">Clothing</option>
        <option value="Savings">Savings</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Shopping">Shopping</option>
      </select>

      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
};

export default AddExpense;
