from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
import json

from models.cv_model import CV
from models.offer_model import Offer
from middlewares.auth_middleware import token_required
from services.crew_ai_service import extract_skills_from_cv
from services.matching_service import calculate_score
from utils.cv_reader import extract_text_from_cv

# ===============================
# Config Upload
# ===============================
UPLOAD_FOLDER = "uploads/cv"
ALLOWED_EXTENSIONS = {"pdf", "docx"}
MAX_FILE_SIZE_MB = 10  # limite serveur (Postman limite ≠ backend)

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
# Upload CV + Analyse
# ===============================
@cv_bp.route("/upload/<offer_id>", methods=["POST"])
@token_required
def upload_cv(current_user, offer_id):

    # ---------- Vérification fichier ----------
    if "cv" not in request.files:
        return jsonify({"error": "No file provided"}), 400

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

    if not cv_text.strip():
        return jsonify({"error": "Unable to read CV content"}), 400

    # ---------- Analyse IA (CrewAI) ----------
    try:
        result = extract_skills_from_cv(cv_text)
    except Exception as e:
        print("❌ CrewAI error:", e)
        return jsonify({"error": "AI extraction failed"}), 500

    # ---------- Conversion CrewOutput → dict ----------
    if hasattr(result, "raw"):
        data = result.raw
    elif hasattr(result, "json"):
        data = result.json
    else:
        data = {}

    # Si le modèle retourne du texte JSON
    if isinstance(data, str):
        try:
            data = json.loads(data)
        except Exception:
            data = {}

    skills = data.get("competences", [])
    full_name = data.get("full_name", "")
    email = data.get("email", "")

    print("📄 CV ANALYSIS RESULT")
    print("Full name:", full_name)
    print("Email:", email)
    print("Skills:", skills)

    # ---------- Matching ----------
    score = calculate_score(skills, offer_id)


    # ---------- Sauvegarde DB ----------
    cv = CV(
        full_name=full_name,
        email=email,
        skills=skills,
        score=score,
        offer_id=offer_id,
        user_id=current_user.email
    )

    cv_id = cv.save()

    # ---------- Attacher CV à l’offre ----------
    Offer.update_cv_ids(offer_id, cv_id)

    # ---------- Réponse ----------
    return jsonify({
        "message": "CV uploaded and analyzed successfully ✅",
        "cv_id": cv_id,
        "score": score,
        "skills": skills,
        "full_name": full_name,
        "email": email
    }), 201
