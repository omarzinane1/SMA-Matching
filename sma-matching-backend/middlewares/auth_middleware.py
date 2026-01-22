# auth_middleware.py
from functools import wraps
from flask import request, jsonify
from utils.jwt_utils import decode_jwt
from models.user_model import User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"error": "Token is missing"}), 401

        data = decode_jwt(token)
        if not data:
            return jsonify({"error": "Invalid token"}), 401

        current_user = User.find_by_id(data["user_id"])
        if not current_user:
            return jsonify({"error": "User not found"}), 401

        return f(current_user, *args, **kwargs)

    return decorated
