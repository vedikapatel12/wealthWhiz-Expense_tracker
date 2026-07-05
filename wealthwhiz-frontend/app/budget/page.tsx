"use client";

import { useEffect, useState } from "react";
import "../dashboard/dashboard.css";

const API_BASE = "http://localhost:5000/api";

/* ================= TYPES ================= */

type User = {
  id: number;
  name: string;
};

type Budget = {
  id: number;
  category: string;
  budget_amount: number;
  spent_amount: number;
  remaining: number;
  percentage_used: number;
};

/* ================= PAGE ================= */

export default function BudgetPage() {
  const [user, setUser] = useState<User | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      window.location.href = "/";
      return;
    }
    setUser(JSON.parse(stored));
  }, []);

  /* ================= LOAD BUDGETS ================= */
  useEffect(() => {
    if (!user) return;

    fetch(`${API_BASE}/budgets?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => setBudgets(data))
      .catch(err => console.error("Budget fetch error:", err));
  }, [user]);

  if (!user) {
    return <p style={{ padding: 40 }}>Loading...</p>;
  }

  /* ================= SUMMARY CALCULATIONS ================= */
  const totalBudget = budgets.reduce((s, b) => s + b.budget_amount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent_amount, 0);
  const remaining = totalBudget - totalSpent;
  const spentPct = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : "0";

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

        <ul className="nav-menu">
          <li className="nav-item" onClick={() => (window.location.href = "/dashboard")}>
            <i className="fas fa-home"></i> Dashboard
          </li>
          <li className="nav-item" onClick={() => (window.location.href = "/expenses")}>
            <i className="fas fa-credit-card"></i> Expenses
          </li>
          <li className="nav-item" onClick={() => (window.location.href = "/groups")}>
            <i className="fas fa-users"></i> Group Expenses
          </li>
          <li className="nav-item" onClick={() => (window.location.href = "/analytics")}>
            <i className="fas fa-chart-bar"></i> Analytics
          </li>
          <li className="nav-item active">
            <i className="fas fa-bullseye"></i> Budget & Goals
          </li>
        </ul>

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
     <main className="main-content budget-page">
        <header className="header">
          <h1 className="page-title">Budget & Goals</h1>
          <div className="header-actions">
            <button className="btn btn-outline">Set Budget</button>
            <button className="btn btn-primary">
              <i className="fas fa-plus"></i> New Goal
            </button>
          </div>
        </header>

        <div className="content">
          {/* ================= STATS ================= */}
          <div className="stats-grid-3">
            <div className="stat-card blue-border">
              <div className="stat-header">
                <span className="stat-title">Total Budget</span>
                <i className="fas fa-wallet stat-icon blue"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value blue">₹{totalBudget.toLocaleString()}</div>
                <div className="stat-change">Monthly budget</div>
              </div>
            </div>

            <div className="stat-card red-border">
              <div className="stat-header">
                <span className="stat-title">Total Spent</span>
                <i className="fas fa-chart-line stat-icon red"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value red">₹{totalSpent.toLocaleString()}</div>
                <div className="stat-change">{spentPct}% of budget</div>
              </div>
            </div>

            <div className="stat-card emerald-border">
              <div className="stat-header">
                <span className="stat-title">Remaining</span>
                <i className="fas fa-piggy-bank stat-icon emerald"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value emerald">₹{remaining.toLocaleString()}</div>
                <div className="stat-change">Available to spend</div>
              </div>
            </div>
          </div>

          {/* ================= BUDGET PROGRESS ================= */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Budget Progress</h3>
              <p className="card-description">
                Track your spending against your budget
              </p>
            </div>

            <div className="card-content">
              <div className="budget-progress">
                {budgets.length === 0 && (
                  <p style={{ color: "#777" }}>No budgets set yet</p>
                )}

                {budgets.map(b => {
                  const percent = Math.round(b.percentage_used);

                  return (
                    <div key={b.id} className="budget-item">
                      <div className="budget-header">
                        <span className="budget-category">
                          {b.category.charAt(0).toUpperCase() + b.category.slice(1)}
                        </span>
                        {percent > 100 && (
                          <span className="over-budget-badge">Over Budget</span>
                        )}
                      </div>

                      <div className="budget-amounts">
                        <span className="spent-amount">
                          ₹{b.spent_amount.toLocaleString()} / ₹{b.budget_amount.toLocaleString()}
                        </span>
                      </div>

                      <div className="progress-bar">
                        <div
                          className="progress-fill emerald"
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>

                      <div className="budget-footer">
                        <span className="percentage">{percent}% used</span>
                        <span className="remaining">
                          ₹{b.remaining.toLocaleString()} remaining
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= SAVINGS GOALS (STATIC FOR NOW) ================= */}
          {/* unchanged – next phase */}
        </div>
      </main>
    </div>
  );
}
