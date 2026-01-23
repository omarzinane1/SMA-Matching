from crewai import Crew
from .tasks import cv_task, offer_task, match_task

def run_matching_crew(cv_text, offer_text):
    tasks = [
        cv_task(cv_text),
        offer_task(offer_text),
    ]

    crew = Crew(tasks=tasks)
    results = crew.kickoff()

    cv_skills = results[0]
    offer_skills = results[1]

    score_crew = Crew(tasks=[match_task(cv_skills, offer_skills)])
    score = score_crew.kickoff()

    return {
        "cv_skills": cv_skills,
        "offer_skills": offer_skills,
        "score": score
    }
