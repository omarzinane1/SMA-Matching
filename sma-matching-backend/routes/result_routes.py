from flask import Blueprint, jsonify
from middlewares.auth_middleware import token_required
from models.cv_model import CV

result_bp = Blueprint("result_bp", __name__)

# ===============================
# Utils: sérialisation CV
# ===============================
def serialize_cv(cv):
    return {
        "id": str(cv.get("_id")),          # 🔥 IMPORTANT
        "full_name": cv.get("full_name"),
        "email": cv.get("email"),
        "score": cv.get("score", 0),
        "skills": cv.get("skills", []),
        "file_url": cv.get("file_url"),
        "created_at": cv.get("created_at"),
    }

# ===============================
# Lister tous les CVs pour une offre
# ===============================
@result_bp.route("/<offer_id>", methods=["GET"])
@token_required
def list_cvs(current_user, offer_id):
    cvs = CV.find_by_offer(offer_id)

    serialized = [serialize_cv(cv) for cv in cvs]

    return jsonify({
        "offer_id": offer_id,
        "cvs": serialized
    }), 200


# ===============================
# Garder uniquement le Top 3 CVs
# ===============================
@result_bp.route("/top3/<offer_id>", methods=["POST"])
@token_required
def top3_cvs(current_user, offer_id):
    cvs = CV.find_by_offer(offer_id)

    if not cvs:
        return jsonify({"error": "No CVs found for this offer"}), 404

    cvs_sorted = sorted(cvs, key=lambda x: x.get("score", 0), reverse=True)

    top3 = cvs_sorted[:3]
    top3_ids = {cv["_id"] for cv in top3}

    # Supprimer les autres
    for cv in cvs_sorted[3:]:
        CV.delete(cv["_id"])

    return jsonify({
        "message": "Top 3 CVs kept successfully ✅",
        "top3": [serialize_cv(cv) for cv in top3]
    }), 200


# ===============================
# Supprimer tous les CVs d'une offre
# ===============================
@result_bp.route("/delete_all/<offer_id>", methods=["DELETE"])
@token_required
def delete_all_cvs(current_user, offer_id):
    CV.delete_all_by_offer(offer_id)
    return jsonify({
        "message": "All CVs for this offer have been deleted ❌"
    }), 200
