from crewai.llm import LLM

groq_llm = LLM(
    model="llama-3.1-8b-instant",
    temperature=0.1,
    max_tokens=1024
)
