# utils/jwt_utils.py
import jwt
from datetime import datetime, timedelta
from config import Config

# ===============================
# Générer un token JWT
# ===============================
def generate_jwt(user_id: str, email: str, role: str, expires_hours: int = 24) -> str:
    """
    Crée un JWT pour l'utilisateur avec expiration.
    """
    payload = {
        "user_id": user_id,
        "email": email,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=expires_hours)
    }
    token = jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm="HS256")
    return token

# ===============================
# Vérifier et décoder un token JWT
# ===============================
def decode_jwt(token: str) -> dict:
    """
    Vérifie et décode un token JWT.
    Retourne le payload si valide, sinon lève une exception.
    """
    try:
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")
