"use client";

import { useEffect, useState } from "react";
import "../dashboard/dashboard.css";

type User = {
  id: number;
  name: string;
};

export default function AnalyticsPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      window.location.href = "/";
      return;
    }
    setUser(JSON.parse(stored));
  }, []);

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
          <li className="nav-item active">
            <i className="fas fa-chart-bar"></i> Analytics
          </li>
          <li className="nav-item" onClick={() => (window.location.href = "/budget")}>
            <i className="fas fa-bullseye"></i> Budget & Goals
          </li>
        </ul>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">{user.name[0]}</div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-plan">Free Plan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="main-content">
        <header className="header">
          <h1 className="page-title">Analytics</h1>
          <select className="select">
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 6 months</option>
          </select>
        </header>

        <div className="content">
          {/* ================= SUMMARY STATS ================= */}
          <div className="stats-grid-3">
            <div className="stat-card blue-border">
              <div className="stat-header">
                <span className="stat-title">Total Spending</span>
                <i className="fas fa-wallet stat-icon blue"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value blue">₹54,580</div>
                <div className="stat-change">Last 30 days</div>
              </div>
            </div>

            <div className="stat-card emerald-border">
              <div className="stat-header">
                <span className="stat-title">Average Daily</span>
                <i className="fas fa-chart-line stat-icon emerald"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value emerald">₹1,820</div>
                <div className="stat-change">Per day</div>
              </div>
            </div>

            <div className="stat-card red-border">
              <div className="stat-header">
                <span className="stat-title">Highest Category</span>
                <i className="fas fa-fire stat-icon red"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value red">Food</div>
                <div className="stat-change">₹24,550 spent</div>
              </div>
            </div>
          </div>

          {/* ================= SPENDING TREND ================= */}
          <div className="card no-hover">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-chart-line"></i> Spending Trend
              </h3>
              <p className="card-description">Monthly spending overview</p>
            </div>

            <div className="card-content">
              <div className="chart-placeholder">
                <i className="fas fa-chart-line chart-icon"></i>
                <h4>Trend Visualization</h4>
                <p>Spending has reduced by 8% compared to last month</p>
              </div>
            </div>
          </div>

          {/* ================= CATEGORY BREAKDOWN ================= */}
          <div className="card no-hover">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-chart-pie"></i> Category Breakdown
              </h3>
              <p className="card-description">Where your money goes</p>
            </div>

            <div className="card-content">
              <div className="category-list">
                {[
                  { name: "Food", amt: 24550 },
                  { name: "Transport", amt: 8925 },
                  { name: "Education", amt: 15675 },
                  { name: "Entertainment", amt: 5430 },
                ].map((c) => (
                  <div key={c.name} className="category-item">
                    <div>
                      <strong>{c.name}</strong>
                      <span>₹{c.amt.toLocaleString()}</span>
                    </div>
                    <span>{Math.round((c.amt / 54580) * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= INSIGHTS ================= */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-lightbulb"></i> Smart Insights
              </h3>
              <p className="card-description">Personalized spending insights</p>
            </div>

            <div className="card-content">
              <ul className="insights-list">
                <li>
                  <i className="fas fa-arrow-down text-emerald"></i>
                  Your food expenses dropped by 12% this month
                </li>
                <li>
                  <i className="fas fa-arrow-up text-red"></i>
                  Transport costs increased due to travel
                </li>
                <li>
                  <i className="fas fa-bullseye text-blue"></i>
                  You are on track to meet your savings goal
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
