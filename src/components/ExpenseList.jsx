// src/components/ExpenseList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ExpenseList.css";

export default function ExpenseList({ newExpenseTrigger, categories = ["All","Groceries", "Utilities", "Transport", "Entertainment", "Miscellaneous"] }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  // For editing
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ item: "", amount: "", currency: "", date: "", category: "", tags: [] });

  // Filters
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterTag, setFilterTag] = useState("");

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

  useEffect(() => {
    fetchExpenses();
  }, [newExpenseTrigger]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      const baseURL = process.env.REACT_APP_API_URL || "http://localhost:4000";
      await axios.delete(`${baseURL}/api/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error(err);
      alert("Error deleting expense");
    }
  };

  const startEdit = (exp) => {
    setEditingId(exp._id);
    setEditValues({
      item: exp.item,
      amount: exp.amount,
      currency: exp.currency,
      date: exp.date.split('T')[0],
      category: exp.category,
      tags: exp.tags,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ item: "", amount: "", currency: "", date: "", category: "", tags: [] });
  };

  const saveEdit = async (id) => {
    try {
      const baseURL = process.env.REACT_APP_API_URL || "http://localhost:4000";
      await axios.put(`${baseURL}/api/expenses/${id}`, {
        ...editValues,
        tags: Array.isArray(editValues.tags) ? editValues.tags : editValues.tags.split(",").map(t => t.trim()),
      });
      cancelEdit();
      fetchExpenses();
    } catch (err) {
      console.error(err);
      alert("Error updating expense");
    }
  };

  // Apply filters
  const filtered = expenses.filter((exp) => {
    const byCategory = filterCategory === "All" || exp.category === filterCategory;
    const byTag = filterTag === "" || exp.tags.some((tag) => tag.toLowerCase().includes(filterTag.toLowerCase()));
    return byCategory && byTag;
  });

  if (loading) return <p>Loading expenses...</p>;
  if (!loading && expenses.length === 0) return <p>No expenses yet.</p>;

  return (
    <div className="expense-list">
      <div className="filter-row">
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input
          type="text"
          placeholder="Filter by tag..."
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Date</th>
            <th>Category</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((exp) => (
            <tr key={exp._id}>
              {editingId === exp._id ? (
                <>
                  <td><input type="text" value={editValues.item} onChange={(e) => setEditValues({ ...editValues, item: e.target.value })} /></td>
                  <td><input type="number" value={editValues.amount} onChange={(e) => setEditValues({ ...editValues, amount: e.target.value })} /></td>
                  <td><input type="text" value={editValues.currency} onChange={(e) => setEditValues({ ...editValues, currency: e.target.value })} /></td>
                  <td><input type="date" value={editValues.date} onChange={(e) => setEditValues({ ...editValues, date: e.target.value })} /></td>
                  <td>
                    <select value={editValues.category} onChange={(e) => setEditValues({ ...editValues, category: e.target.value })}>
                      {categories.slice(1).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </td>
                  <td><input type="text" value={editValues.tags.join(", ")} onChange={(e) => setEditValues({ ...editValues, tags: e.target.value.split(",").map(t=>t.trim()) })} /></td>
                  <td className="action-buttons">
                    <button onClick={() => saveEdit(exp._id)}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{exp.item}</td>
                  <td>{exp.amount.toLocaleString()}</td>
                  <td>{exp.currency}</td>
                  <td>{new Date(exp.date).toLocaleDateString()}</td>
                  <td>{exp.category}</td>
                  <td>{exp.tags.map(t => <span key={t} className="tag">{t}</span>)}</td>
                  <td className="action-buttons">
                    <button onClick={() => startEdit(exp)}>Edit</button>
                    <button onClick={() => handleDelete(exp._id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
