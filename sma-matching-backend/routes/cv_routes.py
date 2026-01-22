from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os

from models.cv_model import CV
from models.offer_model import Offer
from middlewares.auth_middleware import token_required
from services.crew_ai_service import extract_skills_from_cv
from services.matching_service import calculate_score

# ===============================
# Config Upload
# ===============================
UPLOAD_FOLDER = "uploads/cv"
ALLOWED_EXTENSIONS = {"pdf", "docx"}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ===============================
# Blueprint
# ===============================
cv_bp = Blueprint("cv_bp", __name__, url_prefix="/api/cv")

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

    if "cv" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["cv"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed"}), 400

    # ===============================
    # Save file
    # ===============================
    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    # ===============================
    # Extract data from CV
    # ===============================
    skills, full_name, email = extract_skills_from_cv(file_path)
    print("📄 CV ANALYSIS RESULT")
    print("Full name:", full_name)
    print("Email:", email)
    print("Skills:", skills)
    # ===============================
    # Matching score
    # ===============================
    score = calculate_score(skills, offer_id)

    # ===============================
    # Save CV in DB
    # ===============================
    cv = CV(
        full_name=full_name,
        email=email,
        skills=skills,
        score=score,
        offer_id=offer_id
    )
    cv_id = cv.save()

    # ===============================
    # Attach CV to offer
    # ===============================
    Offer.update_cv_ids(offer_id, cv_id)

    return jsonify({
        "message": "CV uploaded and analyzed successfully",
        "cv_id": cv_id,
        "score": score,
        "skills": skills
    }), 201
