// src/components/ExpenseForm.jsx
import React, { useState } from "react";
import axios from "axios";
import "./ExpenseForm.css";

export default function ExpenseForm({ onAdd }) {
  // Initialize date to today's date (YYYY-MM-DD) for default value
  const today = new Date().toISOString().split('T')[0];
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("VND");
  const [date, setDate] = useState(today);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item || !amount) {
      alert("Item and amount are required");
      return;
    }
    try {
      const baseURL = process.env.REACT_APP_API_URL || "http://localhost:4000";
      const res = await axios.post(`${baseURL}/api/expenses`, {
        item,
        amount: parseFloat(amount),
        currency,
        date: date || new Date().toISOString(),
      });
      onAdd(res.data);
      // Reset form, set date back to today
      setItem("");
      setAmount("");
      setCurrency("VND");
      setDate(today);
    } catch (err) {
      console.error(err);
      alert("Error adding expense");
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Item
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="e.g. Eggs"
            required
          />
        </label>
        <label>
          Amount
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="5000"
            required
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Currency
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
          />
        </label>
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
      </div>
      <button type="submit" className="btn-submit">Add Expense</button>
    </form>
  );
}
