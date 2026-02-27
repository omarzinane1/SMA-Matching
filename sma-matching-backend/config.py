# config.py
import os

# Charger dotenv uniquement local (Render kaydir variables direct)
if os.getenv("RENDER") is None:
    from dotenv import load_dotenv
    load_dotenv()

class Config:
    # ===============================
    # MongoDB
    # ===============================
    # Utilise Mongo Atlas en prod, localhost en dev
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/sma_db")

    # ===============================
    # JWT
    # ===============================
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change_this_secret_key")

    # ===============================
    # Crew AI
    # ===============================
    CREW_AI_API_KEY = os.getenv("CREW_AI_API_KEY", "")

    # ===============================
    # Groq / LLM
    # ===============================
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

    # ===============================
    # Flask settings
    # ===============================
    JSON_SORT_KEYS = False  # garder ordre clés JSON
    DEBUG = os.getenv("FLASK_DEBUG", "False") == "True"  # False en prod

    # ===============================
    # CORS / Frontend URL (Next.js)
    # ===============================
    FRONTEND_URLS = os.getenv(
        "FRONTEND_URLS",
        "http://localhost:3000"  # dev
    ).split(",")  # possibilité plusieurs URLs séparées par virgule