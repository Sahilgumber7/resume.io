import re
import spacy

# Load spaCy model (make sure you run: python -m spacy download en_core_web_sm)
nlp = spacy.load("en_core_web_sm")

def extract_email(text: str):
    match = re.findall(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    return match[0] if match else None

def extract_phone(text: str):
    match = re.findall(r"(\+?\d[\d\-\s]{8,}\d)", text)
    return match[0] if match else None

def extract_links(text: str):
    return re.findall(r"(https?://[^\s]+|www\.[^\s]+)", text)

def extract_name(text: str):
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text
    return None

def split_sections(text: str):
    sections = {}
    section_titles = ["education", "experience", "skills", "projects", "certifications"]
    lines = text.split("\n")
    current = None
    for line in lines:
        line_clean = line.strip().lower()
        for sec in section_titles:
            if sec in line_clean:
                current = sec
                sections[current] = []
                break
        else:
            if current:
                sections[current].append(line.strip())
    return sections
