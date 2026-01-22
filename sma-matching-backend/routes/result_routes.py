# routes/result_routes.py
from flask import Blueprint, request, jsonify
from middlewares.auth_middleware import token_required
from models.cv_model import CV
from models.offer_model import Offer

# ===============================
# Blueprint pour résultats
# ===============================
result_bp = Blueprint("result_bp", __name__)

# ===============================
# Lister tous les CVs pour une offre
# ===============================
@result_bp.route("/<offer_id>", methods=["GET"])
@token_required
def list_cvs(current_user, offer_id):
    cvs = CV.find_by_offer(offer_id)
    return jsonify({"cvs": cvs}), 200

# ===============================
# Garder Top 3 CVs
# ===============================
@result_bp.route("/top3/<offer_id>", methods=["POST"])
@token_required
def top3_cvs(current_user, offer_id):
    cvs = CV.find_by_offer(offer_id)
    if not cvs:
        return jsonify({"error": "No CVs found for this offer"}), 404

    # Trier par score décroissant et garder top 3
    top3 = cvs[:3]
    top3_ids = [cv["_id"] for cv in top3]

    # Supprimer tous les CVs qui ne sont pas top 3
    all_cv_ids = [cv["_id"] for cv in cvs]
    for cv_id in all_cv_ids:
        if cv_id not in top3_ids:
            CV.delete(cv_id)

    return jsonify({"message": "Top 3 CVs kept", "top3": top3}), 200

# ===============================
# Supprimer tous les CVs pour une offre
# ===============================
@result_bp.route("/delete_all/<offer_id>", methods=["DELETE"])
@token_required
def delete_all_cvs(current_user, offer_id):
    CV.delete_all_by_offer(offer_id)
    return jsonify({"message": "All CVs for this offer have been deleted"}), 200
