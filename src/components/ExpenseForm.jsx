// src/components/ExpenseForm.jsx
import React, { useState } from "react";
import axios from "axios";

export default function ExpenseForm({ onAdd }) {
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("VND");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item || !amount) {
      alert("Item name and amount are required.");
      return;
    }

    try {
      // CHANGE this baseURL when you deploy the back-end to Render
      const baseURL = process.env.REACT_APP_API_URL || "http://localhost:4000";
      const res = await axios.post(`${baseURL}/api/expenses`, {
        item,
        amount: parseFloat(amount),
        currency,
        date: date || new Date().toISOString(),
      });
      onAdd(res.data); // notify parent to refresh list
      setItem("");
      setAmount("");
      setCurrency("VND");
      setDate("");
    } catch (err) {
      console.error(err);
      alert("Error adding expense. Check console.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <h2>Add a New Expense</h2>
      <div>
        <label>
          Item:{" "}
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="e.g. egg"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Amount:{" "}
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="5000"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Currency:{" "}
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            placeholder="VND"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Date:{" "}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
      </div>
      <button type="submit">Add Expense</button>
    </form>
  );
}
