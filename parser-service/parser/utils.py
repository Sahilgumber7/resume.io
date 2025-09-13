import re
import spacy

nlp = spacy.load("en_core_web_sm")

def extract_email(text):
    match = re.findall(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    return match[0] if match else None

def extract_phone(text):
    match = re.findall(r"(\+?\d[\d\-\s]{8,}\d)", text)
    return match[0] if match else None

def extract_links(text):
    return re.findall(r"(https?://[^\s]+|www\.[^\s]+)", text)

def extract_name(text):
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text
    return None

def split_sections(text):
    sections = {}
    section_titles = ["education", "experience", "skills", "projects", "certifications"]
    lines = text.split("\n")
    current = None
    for line in lines:
        line_clean = line.strip().lower()
        if any(sec in line_clean for sec in section_titles):
            current = line_clean
            sections[current] = []
        elif current:
            sections[current].append(line.strip())
    return sections
