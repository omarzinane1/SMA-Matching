# services/matching_service.py

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

    # ✅ Cas 1 : liste simple de strings
    if isinstance(skills, list) and isinstance(skills[0], str):
        return list(set(normalize(s) for s in skills if s))

    # ✅ Cas 2 : structure avancée CrewAI (list[dict])
    for bloc in skills:
        if isinstance(bloc, dict):
            competences = bloc.get("competences", [])
            for skill in competences:
                if skill:
                    flat.append(normalize(skill))

    return list(set(flat))


def calculate_score(cv_skills_input, offer_skills_input):
    """
    Calcule le score de matching entre :
    - skills du CV
    - skills de l'offre
    """

    # 🔹 Normalisation des skills
    cv_skills = flatten_skills(cv_skills_input)
    offer_skills = flatten_skills(offer_skills_input)

    if not offer_skills:
        return {
            "score": 0,
            "matched_skills": [],
            "reason": "Offer has no skills"
        }

    if not cv_skills:
        return {
            "score": 0,
            "matched_skills": [],
            "reason": "CV has no skills"
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
