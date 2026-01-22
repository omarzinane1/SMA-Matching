# models/offer_model.py
from datetime import datetime
from bson.objectid import ObjectId
from utils.mongo_utils import mongo  # IMPORT GLOBAL mongo

# ===============================
# Collection Offres (sera initialisée après init_db)
# ===============================
offers_collection = None

def init_offer_collection():
    """
    Initialise la collection offers
    ⚠️ À appeler après init_db(app)
    """
    global offers_collection
    offers_collection = mongo.db["offers"]


class Offer:
    def __init__(self, title: str, description: str, cv_ids: list = None):
        self.title = title
        self.description = description
        self.date_created = datetime.utcnow()
        self.cv_ids = cv_ids if cv_ids else []  # Liste des ObjectId de CVs

    # ===============================
    # CRUD
    # ===============================
    def save(self):
        """Enregistrer l'offre dans MongoDB"""
        offer_data = {
            "title": self.title,
            "description": self.description,
            "date_created": self.date_created,
            "cv_ids": self.cv_ids
        }
        result = offers_collection.insert_one(offer_data)
        return str(result.inserted_id)

    @staticmethod
    def find_all():
        """Retourne toutes les offres triées par date (desc)"""
        offers = offers_collection.find().sort("date_created", -1)
        result = []
        for o in offers:
            o["_id"] = str(o["_id"])
            o["cv_ids"] = [str(cv_id) for cv_id in o.get("cv_ids", [])]
            result.append(o)
        return result

    @staticmethod
    def find_by_id(offer_id: str):
        """Trouver une offre par son ID"""
        offer_data = offers_collection.find_one({"_id": ObjectId(offer_id)})
        if offer_data:
            offer_data["_id"] = str(offer_data["_id"])
            offer_data["cv_ids"] = [str(cv_id) for cv_id in offer_data.get("cv_ids", [])]
            return offer_data
        return None

    @staticmethod
    def update_cv_ids(offer_id: str, cv_id: str):
        """Ajouter un CV à l'offre"""
        offers_collection.update_one(
            {"_id": ObjectId(offer_id)},
            {"$addToSet": {"cv_ids": ObjectId(cv_id)}}
        )

    @staticmethod
    def delete(offer_id: str):
        """Supprimer une offre"""
        offers_collection.delete_one({"_id": ObjectId(offer_id)})
