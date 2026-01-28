from models.offer_model import Offer

def normalize(text):
    return text.lower().strip()

def flatten_skills(skills):
    """
    Accepte :
    - list[str]
    - list[dict] avec clé 'competences'
    """
    flat = []

    if not skills:
        return flat

    # ✅ Cas 1 : liste de strings
    if isinstance(skills[0], str):
        return list(set(normalize(s) for s in skills))

    # ✅ Cas 2 : structure JSON (CrewAI avancé)
    for bloc in skills:
        if isinstance(bloc, dict):
            competences = bloc.get("competences", [])
            for skill in competences:
                flat.append(normalize(skill))

    return list(set(flat))


def calculate_score(cv_skills_input, offer_id):
    """
    Calcule le score de matching CV / Offre
    """

    # 🔹 Skills CV
    cv_skills = flatten_skills(cv_skills_input)

    # 🔹 Offre
    offer = Offer.get_by_id(offer_id)
    if not offer:
        return {
            "score": 0,
            "matched_skills": [],
            "reason": "Offer not found"
        }

    offer_skills = [normalize(s) for s in offer.get("skills", [])]

    if not offer_skills:
        return {
            "score": 0,
            "matched_skills": [],
            "reason": "Offer has no skills"
        }

    # 🔹 Matching
    matched = list(set(cv_skills) & set(offer_skills))

    score = round((len(matched) / len(offer_skills)) * 100, 2)

    return {
        "score": score,
        "matched_skills": matched,
        "total_offer_skills": len(offer_skills),
        "total_cv_skills": len(cv_skills)
    }
