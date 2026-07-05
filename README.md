# 💰 WealthWhiz – Student Finance Management System

WealthWhiz is a **student-focused personal finance management system** designed to help track expenses, manage budgets, set savings goals, and visualize spending patterns.
This project was developed as part of an **academic submission**, with a focus on UI/UX design and partial backend integration.


## 🚀 Key Features

### ✅ Implemented

* **Dashboard**

  * Overview of income, expenses, balance, and savings
  * Summary cards with visual indicators
* **Expense Management**

  * Add, view, and categorize expenses
* **Budget & Savings Goals (UI + Partial API)**

  * Budget tracking by category
  * Savings goals with progress visualization
* **Group Expenses (UI)**

  * Group cards, settlements, and split calculator (frontend)
* **Analytics (UI)**

  * Spending trends and budget comparison (frontend)
* **Responsive UI**

  * Works well on desktop and tablet screens

### ⚠️ Partially Implemented / UI Only

* Analytics backend calculations
* Group expense backend logic
* Advanced authentication & authorization

## 🏗️ Tech Stack

### Frontend

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS** (assumed from globals.css and structure)
* **Font Awesome Icons**

### Backend

* **Python (Flask)**
* **SQLite**
* **SQLAlchemy**
* **Flask-CORS**

## 📁 Project Structure

```
WealthWhiz/
├── wealthwhiz-backend/
│   ├── app.py              # Flask backend API
│   ├── requirements.txt    # Backend dependencies
│   └── instance/
│       └── wealthwhiz.db   # SQLite database
│
└── wealthwhiz-frontend/
    ├── eslint.config.mjs
    ├── next-env.d.ts
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    ├── README.md
    ├── tsconfig.json
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── analytics/
    │   │   └── page.tsx
    │   ├── budget/
    │   │   └── page.tsx
    │   ├── components/
    │   │   └── Sidebar.tsx
    │   ├── dashboard/
    │   │   ├── dashboard.css
    │   │   └── page.tsx
    │   ├── expenses/
    │   │   ├── expenses.css
    │   │   └── page.tsx
    │   ├── goals/
    │   │   └── page.tsx
    │   ├── groups/
    │   │   └── page.tsx
    │   └── register/
    │       └── page.tsx
    └── public/
```


## 🛠️ Setup Instructions

### Prerequisites

* Python 3.7+
* Any modern web browser

### 🔧 Backend Setup

```bash
cd wealthwhiz-backend
pip install -r requirements.txt
python app.py
```

Verify backend:

```
http://localhost:5000
```

Expected response:

```json
{"message":"WealthWhiz API is running!"}
```

### 🎨 Frontend Setup

```bash
cd wealthwhiz-frontend
npm install
npm run dev
```

Open in browser:

* Dashboard → [http://localhost:3000](http://localhost:3000)
* Expenses → [http://localhost:3000/expenses](http://localhost:3000/expenses)
* Budget → [http://localhost:3000/budget](http://localhost:3000/budget)
* Groups → [http://localhost:3000/groups](http://localhost:3000/groups)
* Analytics → [http://localhost:3000/analytics](http://localhost:3000/analytics)

## 🔌 API Overview (Backend)

### Core APIs

* `GET /api/dashboard/summary`
* `GET /api/expenses`
* `POST /api/expenses`
* `GET /api/budgets`
* `GET /api/goals`

### Status

* Expense, budget, and goal APIs are **functional**
* Group & analytics APIs are **partially implemented**

## 🎨 UI Highlights

* Clean dashboard layout
* Summary cards with icons
* Circular progress indicators for savings goals
* Hover effects and transitions
* Sidebar navigation consistent across pages

## 📊 Database

* **SQLite** (local)
* Auto-created on backend start
* Tables:

  * users
  * expenses
  * budgets
  * goals
  * groups (partial)

## 🧪 Testing

* Backend tested manually using browser & API calls
* Frontend tested through user interaction
* Error handling verified using invalid inputs

## 🚨 Known Limitations

* No production-level authentication
* Group expenses backend is incomplete
* Analytics charts are UI-based
* Single-user demo setup

These limitations are **intentional** and acceptable for the academic scope.

## 🎯 Future Scope

* Complete group expense settlement logic
* Authentication with JWT
* Data visualization using charts
* Mobile app version
* Cloud database integration

## 🎓 Academic Declaration

This project was developed **solely for educational purposes** and demonstrates:

* Frontend–backend integration
* REST API design
* Database modeling
* UI/UX consistency

## 📜 License

MIT License – Free to use for learning and academic reference.

