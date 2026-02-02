from crewai import Task
from .agents import cv_agent, offer_agent, matching_agent

# ===============================
# Task pour extraire compétences depuis le CV
# ===============================
def cv_task(cv_text):
    return Task(
        description=f"""
Tu es un expert en analyse de CV techniques et RH.

TÂCHE :
- Analyse attentivement le CV ci-dessous.
- Extrais les informations suivantes et retourne-les en JSON strict :
  1. full_name : nom complet du candidat
  2. email : email du candidat
  3. competences : liste des compétences techniques (hard skills)

RÈGLES STRICTES :
- Exclure toute compétence comportementale (soft skills).
- Exclure les langues, diplômes, expériences non techniques.
- Normaliser les compétences (ex: "Python", "Laravel", "React.js").
- Supprimer les doublons.
- Répondre UNIQUEMENT en JSON valide, sans texte supplémentaire.

FORMAT DE SORTIE OBLIGATOIRE :
{{
    "full_name": "",
    "email": "",
    "competences": [
        "skill_1",
        "skill_2",
        "skill_3"
    ]
}}

CV À ANALYSER :
{cv_text}
""",
        expected_output="JSON object with full_name, email, competences",
        agent=cv_agent
    )

# ===============================
# Task pour extraire compétences depuis l’offre
# ===============================
def offer_task(offer_text):
    return Task(
        description=f"""
Tu es un recruteur technique senior.

TÂCHE :
- Analyse l’offre d’emploi ci-dessous.
- Extrais uniquement les compétences techniques requises pour le poste.
- Retourne-les dans un JSON strict.

RÈGLES STRICTES :
- Ignorer les soft skills, missions générales et avantages.
- Normaliser les noms des technologies.
- Supprimer les doublons.
- Répondre UNIQUEMENT en JSON valide.

FORMAT DE SORTIE OBLIGATOIRE :
{{
    "skills": [
        "skill_1",
        "skill_2",
        "skill_3"
    ]
}}

OFFRE D’EMPLOI :
{offer_text}
""",
        expected_output="JSON object with required_skills array",
        agent=offer_agent
    )

# ===============================
# Task pour calculer score de matching
# ===============================
def match_task(cv_skills, offer_skills):
    return Task(
        description=f"""
Tu es un système expert de matching CV ↔ Offre d’emploi.

DONNÉES :
- Compétences du CV : {cv_skills}
- Compétences requises par l’offre : {offer_skills}

TÂCHE :
- Comparer les deux listes de compétences.
- Calculer un score de compatibilité ENTRE 0 ET 100 selon la logique suivante :
  - 100 : toutes les compétences requises sont présentes.
  - 70–90 : majorité des compétences présentes.
  - 40–69 : correspondance partielle.
  - 0–39 : faible ou aucune correspondance.

RÈGLES STRICTES :
- Ne pas expliquer le raisonnement.
- Ne pas retourner de texte.
- Retourner UNIQUEMENT un nombre entier.

FORMAT DE SORTIE OBLIGATOIRE :
85
""",
        expected_output="Integer compatibility score between 0 and 100",
        agent=matching_agent
    )
