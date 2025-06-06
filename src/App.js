// src/App.js
import React, { useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";

function App() {
  // simple counter: bump it to force ExpenseList to re-fetch
  const [newExpenseTrigger, setNewExpenseTrigger] = useState(0);

  const handleAdd = () => {
    setNewExpenseTrigger((prev) => prev + 1);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h1>Family Expense Tracker</h1>
      <ExpenseForm onAdd={handleAdd} />
      <ExpenseList newExpenseTrigger={newExpenseTrigger} />
    </div>
  );
}

export default App;
