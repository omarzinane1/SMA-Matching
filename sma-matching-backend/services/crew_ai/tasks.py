from crewai import Task
from .agents import cv_agent, offer_agent, matching_agent

def cv_task(cv_text):
    return Task(
        description=f"""
Analyse le CV suivant et extrais UNIQUEMENT
les compétences techniques sous forme de liste JSON.

CV:
{cv_text}
""",
        expected_output="JSON array of technical skills",
        agent=cv_agent
    )

def offer_task(offer_text):
    return Task(
        description=f"""
Analyse l'offre suivante et extrais les compétences requises
sous forme de liste JSON.

Offre:
{offer_text}
""",
        expected_output="JSON array of required skills",
        agent=offer_agent
    )

def match_task(cv_skills, offer_skills):
    return Task(
        description=f"""
CV skills: {cv_skills}
Offer skills: {offer_skills}

Calcule un score de compatibilité entre 0 et 100.
""",
        expected_output="Integer score between 0 and 100",
        agent=matching_agent
    )
