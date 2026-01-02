import re
import spacy
from functools import lru_cache

@lru_cache()
def get_nlp():
    try:
        return spacy.load("en_core_web_sm")
    except OSError:
        # If not found, we might need a way to download it or handle the error
        # In a real app, this should be part of the build/install step
        return None

def extract_email(text: str):
    if not text: return None
    match = re.findall(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    return match[0] if match else None

def extract_phone(text: str):
    if not text: return None
    # Improved regex for phone numbers
    match = re.findall(r"(\+?\d[\d\-\s\(\)]{8,}\d)", text)
    return match[0] if match else None

def extract_links(text: str):
    if not text: return []
    return re.findall(r"(https?://[^\s]+|www\.[^\s]+)", text)

def extract_name(text: str):
    if not text: return None
    nlp = get_nlp()
    if not nlp: return None
    
    doc = nlp(text[:500]) # Only check first 500 chars for name
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text
    return None

def split_sections(text: str):
    if not text: return {}
    sections = {}
    section_titles = ["education", "experience", "skills", "projects", "certifications", "summary", "objective"]
    lines = text.split("\n")
    current = None
    
    for line in lines:
        line_clean = line.strip().lower()
        if not line_clean: continue
        
        found_section = False
        for sec in section_titles:
            # Check if line is a section header (usually short and contains the title)
            if sec in line_clean and len(line_clean) < 20:
                current = sec
                sections[current] = []
                found_section = True
                break
        
        if not found_section and current:
            sections[current].append(line.strip())
            
    return {k: "\n".join(v) for k, v in sections.items()}

def clean_text(text: str):
    if not text: return ""
    # Basic cleaning
    text = re.sub(r'\s+', ' ', text)
    return text.strip().lower()
