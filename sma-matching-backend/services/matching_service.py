def calculate_score(cv_skills: list, offer_skills: list) -> float:
    if not offer_skills:
        return 0.0

    match = set(cv_skills) & set(offer_skills)
    return round((len(match) / len(offer_skills)) * 100, 2)
