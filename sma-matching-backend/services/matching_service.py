# services/matching_service.py
from models.offer_model import Offer
from models.cv_model import CV

# ===============================
# Calculer score CV ↔ Offre
# ===============================
def calculate_score(cv_skills: list, offer_id: str) -> float:
    """
    Compare les compétences du CV avec celles de l'offre.
    Retourne un score en pourcentage (0 à 100).
    """

    # ===============================
    # Récupérer offre
    # ===============================
    offer = Offer.find_by_id(offer_id)
    if not offer:
        return 0.0

    # Pour simplifier, on suppose que l'offre contient une liste de compétences dans description
    # Exemple : description = "Python, SQL, Machine Learning"
    offer_skills = [s.strip().lower() for s in offer["description"].split(",")]

    # ===============================
    # Normaliser compétences du CV
    # ===============================
    cv_skills = [s.strip().lower() for s in cv_skills]

    # ===============================
    # Calcul score : % de compétences matching
    # ===============================
    if not offer_skills or not cv_skills:
        return 0.0

    matched = [skill for skill in cv_skills if skill in offer_skills]
    score = (len(matched) / len(offer_skills)) * 100

    # Limiter à 100
    return round(score, 2)
