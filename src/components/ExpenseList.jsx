// src/components/ExpenseList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ExpenseList.css";

export default function ExpenseList({ newExpenseTrigger }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const baseURL = process.env.REACT_APP_API_URL || "http://localhost:4000";
        const res = await axios.get(`${baseURL}/api/expenses`);
        setExpenses(res.data);
      } catch (err) {
        console.error(err);
        alert("Error fetching expenses");
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [newExpenseTrigger]);

  if (loading) return <p>Loading expenses...</p>;
  if (expenses.length === 0) return <p>No expenses yet.</p>;

  return (
    <div className="expense-list">
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp._id}>
              <td>{exp.item}</td>
              <td>{exp.amount.toLocaleString()}</td>
              <td>{exp.currency}</td>
              <td>{new Date(exp.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
