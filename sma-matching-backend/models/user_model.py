from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
from utils.mongo_utils import mongo

users_collection = None  # initialisé après init_db


def init_user_collection():
    global users_collection
    users_collection = mongo.db.users
    print("✅ users_collection initialized")


class User:
    def __init__(
        self,
        full_name: str,
        email: str,
        password_hash: str,
        role: str = "user"
    ):
        self.full_name = full_name
        self.email = email.lower()
        self.password_hash = password_hash
        self.role = role

    # ===============================
    # REGISTER
    # ===============================
    @staticmethod
    def create(full_name: str, email: str, password: str, role: str = "user"):
        password_hash = generate_password_hash(password)

        user_data = {
            "full_name": full_name,
            "email": email.lower(),
            "password_hash": password_hash,
            "role": role
        }

        result = users_collection.insert_one(user_data)
        return str(result.inserted_id)

    # ===============================
    # LOGIN
    # ===============================
    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    # ===============================
    # FIND BY EMAIL
    # ===============================
    @staticmethod
    def find_by_email(email: str):
        user_data = users_collection.find_one({"email": email.lower()})

        if not user_data:
            return None, None

        user = User(
            full_name=user_data["full_name"],
            email=user_data["email"],
            password_hash=user_data["password_hash"],
            role=user_data.get("role", "user")
        )

        return user, str(user_data["_id"])

    # ===============================
    # FIND BY ID  ✅ (MANQUANTE)
    # ===============================
    @staticmethod
    def find_by_id(user_id: str):
        try:
            user_data = users_collection.find_one(
                {"_id": ObjectId(user_id)}
            )

            if not user_data:
                return None

            return User(
                full_name=user_data["full_name"],
                email=user_data["email"],
                password_hash=user_data["password_hash"],
                role=user_data.get("role", "user")
            )
        except Exception:
            return None
