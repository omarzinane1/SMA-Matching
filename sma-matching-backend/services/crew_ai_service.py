# services/crew_ai_service.py
import requests
from config import Config
from utils.file_utils import extract_text_from_file

# ===============================
# Fonction principale : extraction compétences CV
# ===============================
def extract_skills_from_cv(file_path: str):
    """
    Prend un fichier CV (.pdf ou .docx),
    extrait le texte puis envoie à Crew AI pour extraire compétences.
    Retourne : skills (list), full_name (str), email (str)
    """

    # ===============================
    # Extraire texte brut du fichier
    # ===============================
    text = extract_text_from_file(file_path)

    # ===============================
    # Appel Crew AI (exemple API POST)
    # ===============================
    url = "https://api.crew.ai/extract-skills"  # Exemple fictif
    headers = {
        "Authorization": f"Bearer {Config.CREW_AI_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "text": text
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()

        # ===============================
        # Récupérer compétences + infos CV
        # ===============================
        skills = data.get("skills", [])
        full_name = data.get("full_name", "Unknown")
        email = data.get("email", "unknown@example.com")

        return skills, full_name, email

    except Exception as e:
        print("Crew AI extraction error:", e)
        # En cas d'erreur, renvoyer vide
        return [], "Unknown", "unknown@example.com"
