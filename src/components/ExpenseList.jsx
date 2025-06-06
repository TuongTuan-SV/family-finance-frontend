// src/components/ExpenseList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ExpenseList({ newExpenseTrigger }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const baseURL = process.env.REACT_APP_API_URL;
      const res = await axios.get(`${baseURL}/api/expenses`);
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line
  }, [newExpenseTrigger]); // whenever newExpenseTrigger changes, re‐fetch

  return (
    <div>
      <h2>All Expenses</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0">
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
      )}
    </div>
  );
}
