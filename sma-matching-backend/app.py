from dotenv import load_dotenv
load_dotenv()

from flask import Flask
from flask_cors import CORS
import os

# ===============================
# Blueprints (routes)
# ===============================
from routes.auth_routes import auth_bp
from routes.offer_routes import offer_bp
from routes.cv_routes import cv_bp
from routes.result_routes import result_bp

# ===============================
# MongoDB
# ===============================
from utils.mongo_utils import init_db

# Initialisation des collections modèles
from models.user_model import init_user_collection
from models.offer_model import init_offer_collection
from models.cv_model import init_cv_collection

# Désactiver la télémétrie CrewAI
os.environ["CREWAI_DISABLE_TELEMETRY"] = "true"

# ===============================
# Initialisation de l'application Flask
# ===============================
app = Flask(__name__)
app.url_map.strict_slashes = False

# ===============================
# CORS pour le développement local
# ===============================
# Autorise uniquement localhost:3000 pour dev (Next.js)
CORS(
    app,
    resources={
        r"/api/*": {"origins": "http://localhost:3000"},
        r"/auth/*": {"origins": "http://localhost:3000"},  # ajouter si nécessaire
    },
    supports_credentials=True
)

# ===============================
# Chargement de la configuration
# ===============================
app.config.from_object("config.Config")

# ===============================
# Initialisation MongoDB
# ===============================
init_db(app)

# ⚠️ Important : initialiser les collections APRÈS init_db
init_user_collection()
init_offer_collection()
init_cv_collection()

# ===============================
# Enregistrement des Blueprints
# ===============================
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(offer_bp, url_prefix="/api/offers")
app.register_blueprint(cv_bp, url_prefix="/api/cv")
app.register_blueprint(result_bp, url_prefix="/api/results")

# ===============================
# Route de test (health check)
# ===============================
@app.route("/", methods=["GET"])
def index():
    return {
        "status": "ok",
        "message": "SMA Backend Running 🚀"
    }

# ===============================
# Lancement de l'application
# ===============================
if __name__ == "__main__":
    # debug=True uniquement pour dev local
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )