from crewai import Crew
from services.crew_ai.tasks import cv_task, offer_task, match_task


def extract_skills_from_cv(cv_text: str):
    """
    Extract skills + name + email from CV
    """
    task = cv_task(cv_text)

    crew = Crew(
        agents=[task.agent],
        tasks=[task],
        verbose=False
    )

    result = crew.kickoff()

    return result


def extract_skills_from_offer(offer_text: str):
    """
    Extract required skills from job offer description
    """
    task = offer_task(offer_text)

    crew = Crew(
        agents=[task.agent],
        tasks=[task],
        verbose=False
    )

    result = crew.kickoff()

    return result


def calculate_matching_score(cv_skills, offer_skills):
    """
    Calculate compatibility score between CV & Offer
    """
    task = match_task(cv_skills, offer_skills)

    crew = Crew(
        agents=[task.agent],
        tasks=[task],
        verbose=False
    )

    result = crew.kickoff()

    return result
