from crewai import Agent
from crewai.llm import LLM

groq_llm = LLM(
    model="groq/llama3-70b-8192"
)

# ===============================
# Agents CrewAI sans LLM externe
# ===============================

cv_agent = Agent(
    role="HR CV Expert",
    goal="Extract skills from CV",
    backstory="Senior HR expert with deep CV analysis experience",
    llm=groq_llm
)

offer_agent = Agent(
    role="Job Analyst",
    goal="Extract required skills from job offers",
    backstory="Expert in job description analysis",
    llm=groq_llm
)

matching_agent = Agent(
    role="Matching Expert",
    goal="Calculate CV-job compatibility score",
    backstory="Data scientist in HR matching systems",
    llm=groq_llm
)
