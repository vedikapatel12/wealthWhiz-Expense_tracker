"use client";

import "./dashboard.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "http://127.0.0.1:5000/api";

/* ================= TYPES ================= */

type User = {
  id: number;
  name: string;
};

type RecentExpense = {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
};

type Summary = {
  total_income: number;
  total_expenses: number;
  available_balance: number;
  monthly_savings: number;
  category_breakdown: Record<string, number>;
  recent_expenses: RecentExpense[];
};

/* ================= PAGE ================= */

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  /* ================= LOAD DASHBOARD ================= */
  useEffect(() => {
    if (!user) return;

    fetch(`${API_BASE}/dashboard/summary?user_id=${user.id}`)
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch((err) => console.error("Dashboard error:", err));
  }, [user]);

  if (!user || !summary) {
    return <p style={{ padding: 40 }}>Loading dashboard...</p>;
  }

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
          <li
            className="nav-item active"
            onClick={() => router.push("/dashboard")}
          >
            <i className="fas fa-home"></i>
            <span>Dashboard</span>
          </li>

          <li
            className="nav-item"
            onClick={() => router.push("/expenses")}
          >
            <i className="fas fa-credit-card"></i>
            <span>Expenses</span>
          </li>

          <li
            className="nav-item"
            onClick={() => router.push("/groups")}
          >
            <i className="fas fa-users"></i>
            <span>Group Expenses</span>
          </li>

          <li
            className="nav-item"
            onClick={() => router.push("/analytics")}
          >
            <i className="fas fa-chart-bar"></i>
            <span>Analytics</span>
          </li>

          <li
            className="nav-item"
            onClick={() => router.push("/budget")}
          >
            <i className="fas fa-bullseye"></i>
            <span>Budget & Goals</span>
          </li>
        </ul>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="main-content">
        {/* HEADER */}
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <span>{new Date().toDateString()}</span>
        </div>

        {/* WELCOME */}
        <div className="welcome-section">
          <div>
            <h2 className="welcome-title">
              Welcome back, {user.name}! 👋
            </h2>
            <p className="welcome-subtitle">
              Here's your financial overview for today
            </p>
          </div>

          <div className="welcome-actions">
            <button
              className="btn btn-primary"
              onClick={() => router.push("/expenses")}
            >
              <i className="fas fa-plus"></i> Add Expense
            </button>

            <button
              className="btn btn-outline"
              onClick={() => router.push("/budget")}
            >
              <i className="fas fa-bullseye"></i> Set Budget
            </button>
          </div>
        </div>

        {/* ================= SUMMARY ================= */}
        <div className="summary-grid">
          <SummaryCard
            title="Total Income"
            amount={summary.total_income}
            subtitle="+12% from last month"
            icon="fa-arrow-up"
            color="green"
          />

          <SummaryCard
            title="Total Expenses"
            amount={summary.total_expenses}
            subtitle="+8% from last month"
            icon="fa-arrow-down"
            color="red"
          />

          <SummaryCard
            title="Available Balance"
            amount={summary.available_balance}
            subtitle="Updated today"
            icon="fa-wallet"
            color="blue"
          />

          <SummaryCard
            title="Monthly Savings"
            amount={summary.monthly_savings}
            subtitle="On track for goal"
            icon="fa-piggy-bank"
            color="teal"
          />
        </div>

        {/* ================= MIDDLE GRID ================= */}
        <div className="dashboard-grid">
          {/* Spending Trend */}
          <div className="card no-hover">
            <div className="card-header">
              <h3>
                <i className="fas fa-chart-line"></i> Spending Trend
              </h3>
            </div>

            <div className="chart-placeholder">
              <i className="fas fa-chart-line chart-icon"></i>
              <h4>Spending Overview</h4>
              <p>Your expenses are trending well this month</p>

              <div className="chart-stats">
                <span>
                  Average Daily: ₹{(summary.total_expenses / 30).toFixed(0)}
                </span>
                <span>
                  Peak Category: ₹
                  {Math.max(...Object.values(summary.category_breakdown || { a: 0 }))}
                </span>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="card no-hover">
            <div className="card-header">
              <h3>
                <i className="fas fa-chart-pie"></i> Category Breakdown
              </h3>
            </div>

            <div className="category-list">
              {Object.entries(summary.category_breakdown || {}).map(
                ([cat, amt]) => (
                  <div key={cat} className="category-item">
                    <div>
                      <strong>{cat}</strong>
                      <span>₹{amt.toLocaleString()}</span>
                    </div>
                    <span>
                      {summary.total_expenses > 0
                        ? ((amt / summary.total_expenses) * 100).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* ================= RECENT ACTIVITY ================= */}
        <div className="card no-hover">
          <div className="card-header">
            <h3>
              <i className="fas fa-clock"></i> Recent Activity
            </h3>
          </div>

          {summary.recent_expenses.length === 0 && (
            <p style={{ padding: "1rem", color: "#777" }}>
              No recent expenses
            </p>
          )}

          {summary.recent_expenses.map((exp) => (
            <div key={exp.id} className="activity-item">
              <div className="activity-icon expense">
                <i className="fas fa-receipt"></i>
              </div>

              <div className="activity-details">
                <strong>{exp.description || "Expense"}</strong>
                <span>
                  {exp.category} • {new Date(exp.date).toDateString()}
                </span>
              </div>

              <span className="text-red">
                -₹{exp.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

/* ================= COMPONENT ================= */

function SummaryCard({ title, amount, subtitle, icon, color }: any) {
  return (
    <div className="summary-card no-hover">
      <div className={`summary-icon ${color}`}>
        <i className={`fas ${icon}`}></i>
      </div>

      <div className="summary-content">
        <span className="summary-label">{title}</span>
        <h3>₹{amount.toLocaleString()}</h3>
        <span className="summary-sub">{subtitle}</span>
      </div>
    </div>
  );
}
