from crewai.llm import LLM

groq_llm = LLM(
    model="groq/llama-3.3-70b-versatile",
    temperature=0.2,
    max_tokens=1024
)
