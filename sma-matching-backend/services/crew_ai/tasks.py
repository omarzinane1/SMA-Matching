from crewai import Task
from .agents import cv_agent, offer_agent, matching_agent

# ===============================
# Task pour extraire les compétences d'un CV
# ===============================
def cv_task(cv_text: str):
    return Task(
        description=f"Extract skills from this CV:\n{cv_text}",
        agent=cv_agent
    )

# ===============================
# Task pour analyser une offre d'emploi
# ===============================
def offer_task(offer_text: str):
    return Task(
        description=f"Extract required skills from this job offer:\n{offer_text}",
        agent=offer_agent
    )

# ===============================
# Task pour calculer le score de compatibilité CV ↔ Offre
# ===============================
def match_task(cv_skills: list, offer_skills: list):
    return Task(
        description=f"""
        CV skills: {cv_skills}
        Offer skills: {offer_skills}
        Calculate a compatibility score (0-100)
        """,
        agent=matching_agent
    )
