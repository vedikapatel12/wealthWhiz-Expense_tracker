from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, date
import os

app = Flask(__name__)

# ================= CONFIG =================
app.config['SECRET_KEY'] = 'wealthwhiz-secret-key-2024'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

BASEDIR = os.path.abspath(os.path.dirname(__file__))
INSTANCE_DIR = os.path.join(BASEDIR, 'instance')
os.makedirs(INSTANCE_DIR, exist_ok=True)
DB_PATH = os.path.join(INSTANCE_DIR, 'wealthwhiz.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{DB_PATH}"

# ================= EXTENSIONS =================
db = SQLAlchemy(app)
CORS(
    app,
    resources={r"/api/*": {"origins": "*"}},
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)

# ================= HEALTH CHECK (NEW, SAFE) =================
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "service": "WealthWhiz API",
        "status": "ok"
    })

# ================= MODELS =================
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    income = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Income(db.Model):
    __tablename__ = 'incomes'
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    source = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Expense(db.Model):
    __tablename__ = 'expenses'
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200))
    date = db.Column(db.Date, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Budget(db.Model):
    __tablename__ = 'budgets'
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50), nullable=False)
    budget_amount = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

class Goal(db.Model):
    __tablename__ = 'goals'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    target_amount = db.Column(db.Float, nullable=False)
    current_amount = db.Column(db.Float, default=0.0)
    deadline = db.Column(db.Date, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

# ================= INIT DB =================
with app.app_context():
    db.create_all()

# ================= ROOT =================
@app.route('/')
def root():
    return jsonify({"message": "WealthWhiz API is running"})

# ================= AUTH =================
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    user = User(
        name=data['name'],
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        income=data.get('income', 0)
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"id": user.id, "name": user.name})

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({"error": "Invalid credentials"}), 401
    return jsonify({"id": user.id, "name": user.name, "income": user.income})

# ================= EXPENSES (WORKING) =================
@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    user_id = request.args.get('user_id', type=int)
    expenses = Expense.query.filter_by(user_id=user_id).all()
    return jsonify([
        {
            "id": e.id,
            "amount": e.amount,
            "category": e.category,
            "description": e.description,
            "date": e.date.isoformat()
        } for e in expenses
    ])

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    data = request.get_json()
    expense = Expense(
        amount=data['amount'],
        category=data['category'],
        description=data.get('description', ''),
        date=date.fromisoformat(data['date']),
        user_id=data['user_id']
    )
    db.session.add(expense)
    db.session.commit()
    return jsonify({"success": True}), 201

# ================= DASHBOARD =================
@app.route('/api/dashboard/summary', methods=['GET'])
def dashboard_summary():
    user_id = request.args.get('user_id', type=int)
    expenses = Expense.query.filter_by(user_id=user_id).all()
    total_expenses = sum(e.amount for e in expenses)
    user = User.query.get(user_id)

    return jsonify({
        "total_income": user.income,
        "total_expenses": total_expenses,
        "available_balance": user.income - total_expenses,
        "monthly_savings": (user.income - total_expenses) * 0.3,
        "category_breakdown": {},
        "recent_expenses": []
    })

# ================= RUN =================
if __name__ == "__main__":
    app.run(debug=True, port=5000)
