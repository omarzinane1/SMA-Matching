# models/cv_model.py
from bson.objectid import ObjectId
from utils.mongo_utils import mongo  # IMPORT GLOBAL mongo
from datetime import datetime

# ===============================
# Collection CV (sera initialisée après init_db)
# ===============================
cv_collection = None
offer_collection = None  # collection des offres

def init_cv_collection():
    """
    Initialise les collections CVs et Offers
    ⚠️ À appeler après init_db(app)
    """
    global cv_collection, offer_collection
    cv_collection = mongo.db["cvs"]
    offer_collection = mongo.db["offers"]


class CV:
    def __init__(
        self, 
        full_name: str, 
        email: str, 
        skills: list, 
        offer_id: str = None, 
        score: float = 0.0,
        user_id: str = None  # ✅ nouvel attribut user_id
    ):
        self.full_name = full_name
        self.email = email.lower()
        self.skills = skills  # liste de compétences
        self.offer_id = offer_id
        self.score = score
        self.user_id = user_id  # ✅ stocke l'ID ou email de l'utilisateur
        self.date_created = datetime.utcnow()

    # ===============================
    # CRUD
    # ===============================
    def save(self):
        """Enregistrer le CV dans MongoDB et ajouter son _id à l'offre"""
        cv_data = {
            "full_name": self.full_name,
            "email": self.email,
            "skills": self.skills,
            "offer_id": self.offer_id,
            "score": self.score,
            "user_id": self.user_id,
            "date_created": self.date_created
        }
        result = cv_collection.insert_one(cv_data)

        # Ajouter _id dans l'offre
        if self.offer_id:
            offer_collection.update_one(
                {"_id": ObjectId(self.offer_id)},
                {"$push": {"cv_ids": result.inserted_id}}
            )

        return str(result.inserted_id)

    @staticmethod
    def find_by_offer(offer_id: str):
        """Retourne tous les CV associés à une offre, triés par score décroissant"""
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
    def delete(cv_id: str, offer_id: str = None):
        """
        Supprimer un CV et retirer son _id du tableau cv_ids de l'offre
        """
        cv_collection.delete_one({"_id": ObjectId(cv_id)})
        if offer_id:
            offer_collection.update_one(
                {"_id": ObjectId(offer_id)},
                {"$pull": {"cv_ids": ObjectId(cv_id)}}
            )

    @staticmethod
    def delete_all_by_offer(offer_id: str):
        """
        Supprime tous les CVs liés à une offre et vide cv_ids
        """
        # Récupérer tous les CVs de l'offre
        cvs = list(cv_collection.find({"offer_id": offer_id}))
        for cv in cvs:
            CV.delete(cv["_id"], offer_id)

        # Assurer que cv_ids est vide
        offer_collection.update_one(
            {"_id": ObjectId(offer_id)},
            {"$set": {"cv_ids": []}}
        )

        return len(cvs)
    @staticmethod
    def find_by_top_cv(offer_id: str):
        """Retourne les top cv"""
        cvs = cv_collection.find({"offer_id": offer_id}).sort("score", -1)
        result = []
        for cv in cvs:
            # cv["score"] = str(cv["score"])
            result.append(cv)
        return result
