from crewai import Agent, Task, Crew, LLM
import os

if not os.getenv("GROQ_API_KEY"):
    raise RuntimeError("❌ GROQ_API_KEY manquant")

llm = LLM(
    model="groq/llama-3.3-70b-versatile",
    temperature=0.2
)
cv_agent = Agent(
    role="CV Skill Extractor",
    goal="Extraire les compétences techniques depuis un CV",
    backstory="Expert RH en analyse de CV techniques",
    llm=llm,
    verbose=True
)

def extract_skills_from_cv(cv_text: str):
    task = Task(
        description=f"""
        Analyse le CV suivant et retourne uniquement
        les compétences techniques sous forme de JSON.

        CV :
        {cv_text}
        """,
        expected_output="JSON list of skills",
        agent=cv_agent
    )

    crew = Crew(
        agents=[cv_agent],
        tasks=[task],
        verbose=True
    )

    return crew.kickoff()
