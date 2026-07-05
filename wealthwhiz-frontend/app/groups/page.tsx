"use client";

import { useEffect, useState } from "react";
import "../dashboard/dashboard.css";

type User = {
  id: number;
  name: string;
};

export default function GroupsPage() {
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
          <li className="nav-item active">
            <i className="fas fa-users"></i> Group Expenses
          </li>
          <li className="nav-item" onClick={() => (window.location.href = "/analytics")}>
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
          <h1 className="page-title">Group Expenses</h1>
          <button className="btn btn-primary">
            <i className="fas fa-plus"></i> New Group
          </button>
        </header>

        <div className="content">
          {/* ================= GROUPS GRID ================= */}
          <div className="groups-grid">
            {/* Group Card 1 */}
            <div className="group-card">
              <div className="card-header">
                <div className="group-header">
                  <h3 className="card-title">
                    <i className="fas fa-users"></i> Classmates
                  </h3>
                  <span className="badge active">Active</span>
                </div>
                <p className="card-description">3 members</p>
              </div>

              <div className="card-content">
                <div className="group-members">
                  <div className="member-avatar">V</div>
                  <div className="member-avatar">A</div>
                  <div className="member-avatar">N</div>
                </div>

                <div className="group-stats">
                  <div className="stat">
                    <span className="stat-label">Total Expenses</span>
                    <span className="stat-value">₹45,075</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Your Share</span>
                    <span className="stat-value emerald">₹15,025</span>
                  </div>
                </div>

                <div className="group-actions">
                  <button className="btn btn-outline small">Add Expense</button>
                  <button className="btn btn-outline small">View Details</button>
                </div>
              </div>
            </div>

            {/* Group Card 2 */}
            <div className="group-card">
              <div className="card-header">
                <div className="group-header">
                  <h3 className="card-title">
                    <i className="fas fa-users"></i> Study Group
                  </h3>
                  <span className="badge settled">Settled</span>
                </div>
                <p className="card-description">4 members</p>
              </div>

              <div className="card-content">
                <div className="group-members">
                  <div className="member-avatar">V</div>
                  <div className="member-avatar">A</div>
                  <div className="member-avatar">N</div>
                  <div className="member-avatar">Y</div>
                </div>

                <div className="group-stats">
                  <div className="stat">
                    <span className="stat-label">Total Expenses</span>
                    <span className="stat-value">₹8,960</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Your Share</span>
                    <span className="stat-value emerald">₹2,240</span>
                  </div>
                </div>

                <div className="group-actions">
                  <button className="btn btn-outline small">Add Expense</button>
                  <button className="btn btn-outline small">View Details</button>
                </div>
              </div>
            </div>
          </div>

          {/* ================= SETTLEMENT TRACKING ================= */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-exchange-alt"></i> Settlement Tracking
              </h3>
              <p className="card-description">Keep track of who owes what</p>
            </div>

            <div className="card-content">
              <div className="settlements-list">
                <div className="settlement-item">
                  <div className="settlement-info">
                    <div className="settlement-status pending">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="settlement-details">
                      <span className="settlement-name">Achintya • Classmates</span>
                      <span className="settlement-amount">₹4,550 pending</span>
                    </div>
                  </div>
                  <button className="btn btn-primary small">Mark Settled</button>
                </div>

                <div className="settlement-item">
                  <div className="settlement-info">
                    <div className="settlement-status settled">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="settlement-details">
                      <span className="settlement-name">Yaksh • Study Group</span>
                      <span className="settlement-amount">₹1,580 settled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= QUICK SPLIT ================= */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Quick Split Calculator</h3>
              <p className="card-description">Calculate how to split an expense</p>
            </div>

            <div className="card-content">
              <div className="split-calculator">
                <div className="form-grid-3">
                  <div className="form-group">
                    <label>Total Amount (₹)</label>
                    <input type="number" placeholder="0.00" />
                  </div>
                  <div className="form-group">
                    <label>Number of People</label>
                    <input type="number" placeholder="2" />
                  </div>
                  <div className="form-group">
                    <label>&nbsp;</label>
                    <button className="btn btn-primary full-width">
                      Calculate Split
                    </button>
                  </div>
                </div>

                <div className="split-result">
                  <p className="result-label">Each person pays:</p>
                  <p className="result-amount">₹0.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
