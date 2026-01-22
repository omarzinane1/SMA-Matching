# services/cv_service.py
from models.cv_model import CV
from models.offer_model import Offer
from services.crew_ai_service import extract_skills_from_cv
from services.matching_service import calculate_score

# ===============================
# Analyse CV et sauvegarde
# ===============================
def process_cv(file_path: str, offer_id: str) -> dict:
    """
    1. Extraire compétences via Crew AI
    2. Calculer score CV ↔ Offre
    3. Sauvegarder CV dans MongoDB
    4. Mettre à jour l'offre avec le CV
    """

    # ===============================
    # Extraire compétences + infos CV
    # ===============================
    skills, full_name, email = extract_skills_from_cv(file_path)

    # ===============================
    # Calcul score
    # ===============================
    score = calculate_score(skills, offer_id)

    # ===============================
    # Sauvegarder dans MongoDB
    # ===============================
    cv = CV(full_name=full_name, email=email, skills=skills, score=score, offer_id=offer_id)
    cv_id = cv.save()

    # ===============================
    # Associer CV à l'offre
    # ===============================
    Offer.update_cv_ids(offer_id, cv_id)

    # ===============================
    # Retour pour API / frontend
    # ===============================
    return {
        "cv_id": cv_id,
        "full_name": full_name,
        "email": email,
        "skills": skills,
        "score": score
    }
