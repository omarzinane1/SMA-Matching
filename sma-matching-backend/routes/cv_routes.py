from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
import json

from models.cv_model import CV
from models.offer_model import Offer
from middlewares.auth_middleware import token_required
from services.crew_ai_service import extract_skills_from_cv, extract_skills_from_offer
from services.matching_service import calculate_score
from utils.cv_reader import extract_text_from_cv

# ===============================
# Config Upload
# ===============================
UPLOAD_FOLDER = "uploads/cv"
ALLOWED_EXTENSIONS = {"pdf", "docx"}
MAX_FILE_SIZE_MB = 10

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ===============================
# Blueprint
# ===============================
cv_bp = Blueprint("cv_bp", __name__)

# ===============================
# Utils
# ===============================
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ===============================
# Upload CV + Analyse + Matching
# ===============================
@cv_bp.route("/upload/<offer_id>", methods=["POST"])
@token_required
def upload_cv(current_user, offer_id):

    # ---------- Vérification fichier ----------
    if "cv" not in request.files:
        return jsonify({"error": "No CV file provided"}), 400

    file = request.files["cv"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed"}), 400

    # ---------- Taille fichier ----------
    file.seek(0, os.SEEK_END)
    size_mb = file.tell() / (1024 * 1024)
    file.seek(0)

    if size_mb > MAX_FILE_SIZE_MB:
        return jsonify({"error": "File too large (max 10MB)"}), 400

    # ---------- Sauvegarde ----------
    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    # ---------- Lecture CV ----------
    cv_text = extract_text_from_cv(file_path)
    if not cv_text or not cv_text.strip():
        return jsonify({"error": "Unable to extract text from CV"}), 400

    # ---------- Analyse IA CV ----------
    try:
        cv_result = extract_skills_from_cv(cv_text)
    except Exception as e:
        print("❌ CrewAI CV error:", e)
        return jsonify({"error": "AI extraction failed"}), 500

    # ---------- Normalisation résultat CV ----------
    data = {}
    if hasattr(cv_result, "raw"):
        data = cv_result.raw
    elif hasattr(cv_result, "json"):
        data = cv_result.json

    if isinstance(data, str):
        try:
            data = json.loads(data)
        except Exception:
            data = {}

    full_name = data.get("full_name", "")
    email = data.get("email", "")
    skills = data.get("skills") or data.get("competences") or []

    if not isinstance(skills, list):
        skills = []

    # ---------- Récupérer l’offre ----------
    offer = Offer.get_by_id(offer_id)
    if not offer:
        return jsonify({"error": "Offer not found"}), 404

    # ---------- Analyse IA Offre ----------
    try:
        offer_result = extract_skills_from_offer(offer["description"])

        offer_data = {}
        if hasattr(offer_result, "raw"):
            offer_data = offer_result.raw
        elif hasattr(offer_result, "json"):
            offer_data = offer_result.json

        if isinstance(offer_data, str):
            offer_data = json.loads(offer_data)

        offer_skills = offer_data.get("skills", [])

        if not isinstance(offer_skills, list):
            offer_skills = []

    except Exception as e:
        print("❌ CrewAI Offer extraction error:", e)
        offer_skills = []

    # ---------- Matching ----------
    try:
        matching_score = calculate_score(skills, offer_skills)
    except Exception as e:
        print("❌ Matching error:", e)
        matching_score = {
            "matched_skills": [],
            "reason": "Matching failed",
            "score": 0
        }

    # ---------- Sauvegarde DB ----------
    cv = CV(
        full_name=full_name,
        email=email,
        skills=skills,
        score=matching_score,
        offer_id=offer_id,
        user_id=getattr(current_user, "id", current_user.email)
    )

    cv_id = cv.save()

    # ---------- Attacher CV à l’offre ----------
    Offer.update_cv_ids(offer_id, cv_id)

    # ---------- Réponse ----------
    return jsonify({
        "message": "CV uploaded successfully ✅",
        "cv_id": cv_id,
        "score": matching_score,
        "full_name": full_name,
        "email": email,
        "skills": skills
    }), 201
