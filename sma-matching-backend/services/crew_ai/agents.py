from crewai import Agent
from .llm import groq_llm

cv_agent = Agent(
    role="CV Analyzer",
    goal="Extract technical skills from a CV",
    backstory="Senior HR expert specialized in CV parsing",
    llm=groq_llm,
    verbose=True
)

offer_agent = Agent(
    role="Job Offer Analyzer",
    goal="Extract required skills from job offers",
    backstory="Expert in job description analysis",
    llm=groq_llm,
    verbose=True
)

matching_agent = Agent(
    role="Matching Expert",
    goal="Calculate compatibility score between CV and job offer",
    backstory="Data scientist specialized in HR matching systems",
    llm=groq_llm,
    verbose=True
)
