from crewai import Crew
from .tasks import cv_task, offer_task, match_task

def run_matching_crew(cv_text, offer_text):
    tasks = [
        cv_task(cv_text),
        offer_task(offer_text)
    ]

    crew = Crew(
        tasks=tasks,
        process="sequential",
        verbose=True
    )

    result = crew.kickoff()
    return result
