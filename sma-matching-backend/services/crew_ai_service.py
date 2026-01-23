from crewai import Agent, Task, Crew
from crewai.llm import LLM

groq_llm = LLM(
    model="groq/llama3-70b-8192"
)

cv_agent = Agent(
    role="CV Analyzer",
    goal="Extraire les compétences techniques depuis un CV",
    backstory="Expert en recrutement IT",
    llm=groq_llm,
    verbose=True
)

def extract_skills_from_cv(cv_text: str):

    task = Task(
        description=f"""
        Analyse le CV suivant et extrais uniquement
        les compétences techniques sous forme de liste JSON.

        CV:
        {cv_text}
        """,
        expected_output="""
        Un tableau JSON de compétences techniques.
        Exemple:
        ["Python", "Flask", "React", "Docker"]
        """,
        agent=cv_agent
    )

    crew = Crew(
        agents=[cv_agent],
        tasks=[task],
        verbose=True
    )

    result = crew.kickoff()
    return result
