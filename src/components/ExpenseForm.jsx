// src/components/ExpenseForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ExpenseForm.css";

export default function ExpenseForm({ onAdd }) {
  const today = new Date().toISOString().split('T')[0];
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("VND");
  const [date, setDate] = useState(today);

  // Validation state
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Validate fields whenever they change
  useEffect(() => {
    const newErrors = {};
    if (!item.trim()) newErrors.item = "Item name is required.";
    if (!amount) newErrors.amount = "Amount is required.";
    else if (isNaN(amount) || Number(amount) <= 0) newErrors.amount = "Enter a positive number.";
    if (!currency.trim()) newErrors.currency = "Currency is required.";
    if (new Date(date) > new Date(today)) newErrors.date = "Date cannot be in the future.";

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [item, amount, currency, date, today]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    try {
      const baseURL = process.env.REACT_APP_API_URL || "http://localhost:4000";
      const res = await axios.post(`${baseURL}/api/expenses`, {
        item: item.trim(),
        amount: parseFloat(amount),
        currency: currency.trim(),
        date,
      });
      onAdd(res.data);
      // Reset form
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
    <form className="expense-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <label>
          Item
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="e.g. Eggs"
          />
          {errors.item && <span className="error-msg">{errors.item}</span>}
        </label>
        <label>
          Amount
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="5000"
          />
          {errors.amount && <span className="error-msg">{errors.amount}</span>}
        </label>
      </div>
      <div className="form-row">
        <label>
          Currency
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          />
          {errors.currency && <span className="error-msg">{errors.currency}</span>}
        </label>
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {errors.date && <span className="error-msg">{errors.date}</span>}
        </label>
      </div>
      <button
        type="submit"
        className="btn-submit"
        disabled={!isValid}
      >
        Add Expense
      </button>
    </form>
  );
}
