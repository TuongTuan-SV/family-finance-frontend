// src/App.js
import React, { useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import "./App.css";

function App() {
  const [newExpenseTrigger, setNewExpenseTrigger] = useState(0);
  const handleAdd = () => setNewExpenseTrigger((prev) => prev + 1);

  return (
    <div className="app-container">
      <h1 className="app-title">Family Expense Tracker</h1>
      <ExpenseForm onAdd={handleAdd} />
      <ExpenseList newExpenseTrigger={newExpenseTrigger} />
    </div>
  );
}

export default App;
