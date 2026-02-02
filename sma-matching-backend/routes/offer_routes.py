# routes/offer_routes.py
from flask import Blueprint, request, jsonify
from middlewares.auth_middleware import token_required
from models.offer_model import Offer

# ===============================
# Blueprint : Offres
# ===============================
offer_bp = Blueprint("offer_bp", __name__, url_prefix="/offers")


# ===============================
# Créer une offre
# ===============================
@offer_bp.route("", methods=["POST"])
@token_required
def create_offer(current_user):
    data = request.get_json() or {}

    title = data.get("title", "").strip()
    description = data.get("description", "").strip()

    if not title or not description:
        return jsonify({
            "error": "Title and description are required"
        }), 400

    # ✅ CORRECTION ICI
    offer = Offer(
        title=title,
        description=description
    )

    offer_id = offer.save()

    return jsonify({
        "message": "Offer created successfully ✅",
        "offer_id": offer_id
    }), 201


# ===============================
# Lister toutes les offres
# ===============================
@offer_bp.route("", methods=["GET"])
@token_required
def list_offers(current_user):
    offers = Offer.find_all()

    return jsonify({
        "count": len(offers),
        "offers": offers
    }), 200


# ===============================
# Récupérer une offre par ID
# ===============================
@offer_bp.route("/<offer_id>", methods=["GET"])
@token_required
def get_offer(current_user, offer_id):
    offer = Offer.find_by_id(offer_id)

    if not offer:
        return jsonify({
            "error": "Offer not found"
        }), 404

    return jsonify({
        "offer": offer
    }), 200


# ===============================
# Supprimer une offre
# ===============================
@offer_bp.route("/<offer_id>", methods=["DELETE"])
@token_required
def delete_offer(current_user, offer_id):
    offer = Offer.find_by_id(offer_id)

    if not offer:
        return jsonify({
            "error": "Offer not found"
        }), 404

    Offer.delete(offer_id)

    return jsonify({
        "message": "Offer deleted successfully 🗑️"
    }), 200
