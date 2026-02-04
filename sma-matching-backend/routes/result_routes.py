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
# ===============================
# Garder uniquement le Top 3 CVs avec score >= 75
# ===============================
@result_bp.route("/top3/<offer_id>", methods=["POST"])
@token_required
def top3_cvs(current_user, offer_id):
    cvs = CV.find_by_offer(offer_id)

    if not cvs:
        return jsonify({"error": "No CVs found for this offer"}), 404

    # Fonction pour récupérer score correctement
    def get_score(cv):
        score = cv.get("score", 0)
        if isinstance(score, dict):
            return score.get("score", 0)
        if isinstance(score, (int, float)):
            return score
        return 0

    # Trier les CVs par score décroissant
    cvs_sorted = sorted(cvs, key=get_score, reverse=True)

    # Filtrer les CVs avec score >= 75
    cvs_above_75 = [cv for cv in cvs_sorted if get_score(cv) >= 75]

    # Garder top 3
    top3 = cvs_above_75[:3]
    ids_to_keep = {cv["_id"] for cv in top3}

    # Supprimer les CVs restants (score < 75 ou hors top3)
    for cv in cvs_sorted:
        if cv["_id"] not in ids_to_keep:
            CV.delete(cv["_id"], offer_id)  # ✅ supprime aussi de cv_ids

    # Sérialisation sécurisée pour l'affichage
    def serialize_cv_safe(cv):
        score = cv.get("score", 0)
        if isinstance(score, dict):
            score = score.get("score", 0)
        return {
            "_id": str(cv.get("_id")),
            "full_name": cv.get("full_name") or cv.get("email") or "Unknown",
            "email": cv.get("email", "Unknown"),
            "score": float(score), 
        }


    return jsonify({
        "message": "Top 3 CVs (score >= 75) kept successfully ✅",
        "top3": [serialize_cv_safe(cv) for cv in top3]
    }), 200

# ===============================
# Supprimer tous les CVs d'une offre
# ===============================
@result_bp.route("/delete_all/<offer_id>", methods=["DELETE"])
@token_required
def delete_all_cvs(current_user, offer_id):
    try:
        deleted_count = CV.delete_all_by_offer(offer_id)
        return jsonify({
            "message": f"All CVs for this offer have been deleted ❌ ({deleted_count} removed)"
        }), 200
    except AttributeError:
        return jsonify({"error": "delete_all_by_offer not implemented in CV model"}), 500

