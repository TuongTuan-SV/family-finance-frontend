// src/components/ExpenseForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ExpenseForm.css";

export default function ExpenseForm({ onAdd, categories = ["Groceries", "Utilities", "Transport", "Entertainment", "Miscellaneous"] }) {
  const today = new Date().toISOString().split('T')[0];
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("VND");
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState(categories[0]);
  const [tags, setTags] = useState(""); // comma-separated tags

  // Validation state
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const newErrors = {};
    if (!item.trim()) newErrors.item = "Item name is required.";
    if (!amount) newErrors.amount = "Amount is required.";
    else if (isNaN(amount) || Number(amount) <= 0) newErrors.amount = "Enter a positive number.";
    if (!currency.trim()) newErrors.currency = "Currency is required.";
    if (!category.trim()) newErrors.category = "Category is required.";
    if (new Date(date) > new Date(today)) newErrors.date = "Date cannot be in the future.";

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [item, amount, currency, category, date, today]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    try {
      const baseURL = process.env.REACT_APP_API_URL || "http://localhost:4000";
      const payload = {
        item: item.trim(),
        amount: parseFloat(amount),
        currency: currency.trim(),
        date,
        category: category.trim(),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== ""),
      };
      const res = await axios.post(`${baseURL}/api/expenses`, payload);
      onAdd(res.data);
      // Reset form
      setItem("");
      setAmount("");
      setCurrency("VND");
      setDate(today);
      setCategory(categories[0]);
      setTags("");
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
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <span className="error-msg">{errors.category}</span>}
        </label>
      </div>
      <div className="form-row">
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {errors.date && <span className="error-msg">{errors.date}</span>}
        </label>
        <label>
          Tags (comma-separated)
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. breakfast, dairy"
          />
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
