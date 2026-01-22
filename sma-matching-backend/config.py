# config.py
import os

class Config:
    # ===============================
    # MongoDB
    # ===============================
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/sma_db")

    # ===============================
    # JWT
    # ===============================
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change_this_secret_key")

    # ===============================
    # Crew AI
    # ===============================
    CREW_AI_API_KEY = os.getenv("CREW_AI_API_KEY", "your_crew_ai_key_here")

    # ===============================
    # Autres configurations Flask
    # ===============================
    JSON_SORT_KEYS = False  # Pour garder l'ordre des clés dans les réponses JSON
    DEBUG = True            # Active le debug Flask (désactiver en prod)
