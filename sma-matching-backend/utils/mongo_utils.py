# utils/mongo_utils.py
from flask_pymongo import PyMongo

# Instance globale PyMongo
mongo = PyMongo()

def init_db(app):
    """
    Initialise la connexion MongoDB avec l'application Flask
    """
    mongo.init_app(app)
    print("✅ MongoDB initialized")
    return mongo.db  # <-- retourne mongo.db pour initialisation des collections

def test_connection():
    try:
        mongo.db.list_collection_names()
        print("MongoDB connection: OK ✅")
    except Exception as e:
        print("MongoDB connection error ❌:", e)
