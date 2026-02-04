# routes/auth_routes.py
from flask import Blueprint, request, jsonify
import jwt
from datetime import datetime, timedelta
from models.user_model import User
from config import Config

# ===============================
# Blueprint pour auth
# ===============================
auth_bp = Blueprint("auth_bp", __name__)

# ===============================
# Route Register
# ===============================
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "HR Manager")  # <- par défaut "user" si non fourni

    # Vérifier champs obligatoires
    if not full_name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    # Vérifier si email existe déjà
    existing_user, _ = User.find_by_email(email)
    if existing_user:
        return jsonify({"error": "Email already exists"}), 400

    # Créer utilisateur via la méthode create pour gérer role
    user_id = User.create(full_name=full_name, email=email, password=password, role=role)

    return jsonify({
        "message": "User registered successfully",
        "user_id": user_id,
        "role": role
    }), 201

# ===============================
# Route Login
# ===============================
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user, user_id = User.find_by_email(email)
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Générer JWT
    token_payload = {
        "user_id": user_id,
        "email": user.email,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(hours=24)  # Expiration 24h
    }
    token = jwt.encode(token_payload, Config.JWT_SECRET_KEY, algorithm="HS256")

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "user_id": user_id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role
        }
    }), 200
