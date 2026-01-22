# utils/file_utils.py
import os
from docx import Document
from PyPDF2 import PdfReader

# ===============================
# Extraire texte d'un fichier DOCX
# ===============================
def extract_text_from_docx(file_path: str) -> str:
    try:
        doc = Document(file_path)
        full_text = []
        for para in doc.paragraphs:
            full_text.append(para.text)
        return "\n".join(full_text)
    except Exception as e:
        print("Error reading DOCX:", e)
        return ""

# ===============================
# Extraire texte d'un fichier PDF
# ===============================
def extract_text_from_pdf(file_path: str) -> str:
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print("Error reading PDF:", e)
        return ""

# ===============================
# Fonction générique pour extraire texte
# ===============================
def extract_text_from_file(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext == ".docx":
        return extract_text_from_docx(file_path)
    else:
        print("Unsupported file type:", ext)
        return ""
