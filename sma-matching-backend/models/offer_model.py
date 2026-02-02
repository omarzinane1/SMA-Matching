# models/offer_model.py
from datetime import datetime
from bson.objectid import ObjectId
from utils.mongo_utils import mongo

# ===============================
# Collection Offres
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
        self.cv_ids = cv_ids if cv_ids else []

    # ===============================
    # CREATE
    # ===============================
    def save(self):
        offer_data = {
            "title": self.title,
            "description": self.description,
            "date_created": self.date_created,
            "cv_ids": self.cv_ids
        }
        result = offers_collection.insert_one(offer_data)
        return str(result.inserted_id)

    # ===============================
    # READ
    # ===============================
    @staticmethod
    def find_all():
        offers = offers_collection.find().sort("date_created", -1)
        result = []

        for o in offers:
            o["_id"] = str(o["_id"])
            o["cv_ids"] = [str(cv_id) for cv_id in o.get("cv_ids", [])]
            result.append(o)

        return result

    @staticmethod
    def find_by_id(offer_id):
        try:
            if isinstance(offer_id, list):
                print("❌ offer_id is a list:", offer_id)
                return None

            offer = offers_collection.find_one(
                {"_id": ObjectId(str(offer_id))}
            )

            if not offer:
                return None

            offer["_id"] = str(offer["_id"])
            offer["cv_ids"] = [str(cv_id) for cv_id in offer.get("cv_ids", [])]
            return offer

        except Exception as e:
            print("❌ Error find_by_id:", e)
            return None


    # ✅ ALIAS POUR COMPATIBILITÉ BACKEND
    @staticmethod
    def get_by_id(offer_id: str):
        return Offer.find_by_id(offer_id)

    # ===============================
    # UPDATE
    # ===============================
    @staticmethod
    def update_cv_ids(offer_id: str, cv_id: str):
        offers_collection.update_one(
            {"_id": ObjectId(offer_id)},
            {"$addToSet": {"cv_ids": ObjectId(cv_id)}}
        )

    # ===============================
    # DELETE
    # ===============================
    @staticmethod
    def delete(offer_id: str):
        offers_collection.delete_one(
            {"_id": ObjectId(offer_id)}
        )
