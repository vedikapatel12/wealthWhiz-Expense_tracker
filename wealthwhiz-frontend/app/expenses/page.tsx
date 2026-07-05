"use client";

import { useEffect, useState } from "react";
import "../dashboard/dashboard.css";

const API_BASE = "http://localhost:5000/api";

/* ================= TYPES ================= */

type User = {
  id: number;
  name: string;
};

type Expense = {
  id: number;
  amount: number;
  category: string;
  description: string;
  date: string;
};

/* ================= PAGE ================= */

export default function ExpensesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filtered, setFiltered] = useState<Expense[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  /* FORM STATE */
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  /* ================= LOAD USER ================= */

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      window.location.href = "/";
      return;
    }
    setUser(JSON.parse(stored));
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  /* ================= LOAD EXPENSES ================= */

  useEffect(() => {
    if (!user) return;
    loadExpenses();
  }, [user, filter, search]);

  async function loadExpenses() {
    let url = `${API_BASE}/expenses?user_id=${user!.id}`;

    if (filter !== "all") url += `&category=${filter}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const res = await fetch(url);
    const data = await res.json();

    setExpenses(data);
    setFiltered(data);
  }

  /* ================= SUBMIT ================= */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!amount || !category || !date) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      amount: Number(amount),
      category,
      description,
      date,
      user_id: user!.id,
    };

    const url = editingId
      ? `${API_BASE}/expenses/${editingId}`
      : `${API_BASE}/expenses`;

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Failed to save expense");
      return;
    }

    alert(editingId ? "Expense updated!" : "Expense added!");

    resetForm();
    loadExpenses();
  }

  function resetForm() {
    setEditingId(null);
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
  }

  /* ================= ACTIONS ================= */

  function editExpense(exp: Expense) {
    setEditingId(exp.id);
    setAmount(String(exp.amount));
    setCategory(exp.category);
    setDescription(exp.description || "");
    setDate(exp.date);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteExpense(id: number) {
    if (!confirm("Delete this expense?")) return;

    await fetch(`${API_BASE}/expenses/${id}`, { method: "DELETE" });
    alert("Expense deleted");
    loadExpenses();
  }

  if (!user) return <p style={{ padding: 40 }}>Loading...</p>;

  return (
    <div className="app-container">

      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">₹</div>
            <div className="logo-text">
              <span className="logo-title">WealthWhiz</span>
              <span className="logo-subtitle">Student Finance</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-menu">
            <li className="nav-item" onClick={() => (location.href = "/dashboard")}>
              <i className="fas fa-home"></i>
              <span>Dashboard</span>
            </li>

            <li className="nav-item active">
              <i className="fas fa-credit-card"></i>
              <span>Expenses</span>
            </li>

            <li className="nav-item" onClick={() => (location.href = "/groups")}>
              <i className="fas fa-users"></i>
              <span>Group Expenses</span>
            </li>

            <li className="nav-item" onClick={() => (location.href = "/analytics")}>
              <i className="fas fa-chart-bar"></i>
              <span>Analytics</span>
            </li>

            <li className="nav-item" onClick={() => (location.href = "/budget")}>
              <i className="fas fa-bullseye"></i>
              <span>Budget & Goals</span>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-plan">Free Plan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="main-content">

        <h1 className="page-title">Expense Tracking</h1>

        {/* ADD EXPENSE */}
        <div className="card">
          <div className="card-header">
            <h3>
              <i className="fas fa-plus"></i> Add New Expense
            </h3>
          </div>

          <form className="expense-form" onSubmit={handleSubmit}>
            <div className="form-grid">

              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="food">Food</option>
                  <option value="transport">Transport</option>
                  <option value="education">Education</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="shopping">Shopping</option>
                  <option value="health">Health</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <button className="btn btn-primary full-width">
                {editingId ? "Update Expense" : "Add Expense"}
              </button>
            </div>
          </form>
        </div>

        {/* FILTER & SEARCH */}
        <div className="card">
          <div className="card-header">
            <h3>
              <i className="fas fa-filter"></i> Filter & Search
            </h3>
          </div>

          <div className="card-content">
            <div className="filter-section">

              <div className="search-container">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search expenses..."
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="filter-buttons">
                {["all","food","transport","education","entertainment","shopping","health","other"].map(c => (
                  <button
                    key={c}
                    className={`filter-btn ${filter === c ? "active" : ""}`}
                    onClick={() => setFilter(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="card">
          <p>Showing {filtered.length} expenses</p>

          {filtered.map(exp => (
            <div key={exp.id} className="expense-item">
              <div className="expense-info">
                <div className="expense-amount-circle">₹{exp.amount}</div>
                <div>
                  <strong>{exp.description || "Expense"}</strong>
                  <div>{exp.category} • {exp.date}</div>
                </div>
              </div>

              <div className="expense-actions">
                <button onClick={() => editExpense(exp)}>
                  <i className="fas fa-edit"></i>
                </button>
                <button onClick={() => deleteExpense(exp.id)}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
