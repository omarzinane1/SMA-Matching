from utils.file_utils import extract_text_from_file
from services.crew_ai_service import analyze_cv_and_offer

def process_cv(file_path: str, offer_text: str):
    cv_text = extract_text_from_file(file_path)
    return analyze_cv_and_offer(cv_text, offer_text)
