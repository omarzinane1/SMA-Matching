# models/cv_model.py
from bson.objectid import ObjectId
from utils.mongo_utils import mongo  # IMPORT GLOBAL mongo
from datetime import datetime

# ===============================
# Collection CV (sera initialisée après init_db)
# ===============================
cv_collection = None

def init_cv_collection():
    """
    Initialise la collection CVs
    ⚠️ À appeler après init_db(app)
    """
    global cv_collection
    cv_collection = mongo.db["cvs"]


class CV:
    def __init__(self, full_name: str, email: str, skills: list, offer_id: str = None, score: float = 0.0):
        self.full_name = full_name
        self.email = email.lower()
        self.skills = skills  # liste de compétences
        self.offer_id = offer_id
        self.score = score
        self.date_created = datetime.utcnow()

    # ===============================
    # CRUD
    # ===============================
    def save(self):
        """Enregistrer le CV dans MongoDB"""
        cv_data = {
            "full_name": self.full_name,
            "email": self.email,
            "skills": self.skills,
            "offer_id": self.offer_id,
            "score": self.score,
            "date_created": self.date_created
        }
        result = cv_collection.insert_one(cv_data)
        return str(result.inserted_id)

    @staticmethod
    def find_by_offer(offer_id: str):
        """Retourne tous les CV associés à une offre"""
        cvs = cv_collection.find({"offer_id": offer_id}).sort("score", -1)
        result = []
        for cv in cvs:
            cv["_id"] = str(cv["_id"])
            result.append(cv)
        return result

    @staticmethod
    def update_score(cv_id: str, score: float):
        """Mettre à jour le score d'un CV"""
        cv_collection.update_one(
            {"_id": ObjectId(cv_id)},
            {"$set": {"score": score}}
        )

    @staticmethod
    def delete(cv_id: str):
        """Supprimer un CV"""
        cv_collection.delete_one({"_id": ObjectId(cv_id)})
