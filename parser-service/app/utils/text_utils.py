import re
import spacy
from functools import lru_cache
from typing import Dict, List, Optional

@lru_cache()
def get_nlp():
    try:
        return spacy.load("en_core_web_sm")
    except OSError:
        return None

def _normalize_whitespace(text: str) -> str:
    return re.sub(r"[ \t]+", " ", text or "").strip()


def _clean_line(line: str) -> str:
    if not line:
        return ""
    line = line.replace("\u2022", "-").replace("\uf0b7", "-")
    line = line.replace("\u2013", "-").replace("\u2014", "-")
    return _normalize_whitespace(line)


def extract_email(text: str) -> Optional[str]:
    if not text:
        return None
    match = re.findall(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    return match[0] if match else None


def extract_phone(text: str) -> Optional[str]:
    if not text:
        return None
    matches = re.findall(r"(\+?\d[\d\-\s\(\)]{8,}\d)", text)
    if not matches:
        return None
    best = max(matches, key=len).strip()
    best = re.sub(r"\s+", " ", best)
    return best


def extract_links(text: str) -> List[str]:
    if not text:
        return []
    links = re.findall(r"(https?://[^\s]+|www\.[^\s]+|linkedin\.com/[^\s]+|github\.com/[^\s]+)", text)
    # Keep order and dedupe
    seen = set()
    ordered = []
    for link in links:
        normalized = link.rstrip(".,);")
        if normalized not in seen:
            seen.add(normalized)
            ordered.append(normalized)
    return ordered


def extract_name(text: str) -> Optional[str]:
    if not text:
        return None
    nlp = get_nlp()
    if nlp:
        doc = nlp(text[:500])
        for ent in doc.ents:
            if ent.label_ == "PERSON" and len(ent.text.split()) <= 4:
                return _clean_line(ent.text)
    # Fallback heuristic: first meaningful line that looks like a human name
    for raw_line in text.splitlines()[:15]:
        line = _clean_line(raw_line)
        if not line:
            continue
        if any(token in line.lower() for token in ["@", "http", "linkedin", "github", "resume"]):
            continue
        if len(line) > 60:
            continue
        if re.fullmatch(r"[A-Za-z][A-Za-z .'-]{1,50}", line):
            words = line.split()
            if 2 <= len(words) <= 4:
                return line
    return None


SECTION_ALIASES = {
    "summary": ["summary", "profile", "professional summary", "objective", "about"],
    "experience": ["experience", "work experience", "employment", "professional experience"],
    "education": ["education", "academic", "academics", "qualification", "qualifications"],
    "skills": ["skills", "technical skills", "core skills", "competencies", "expertise"],
    "projects": ["projects", "project experience", "personal projects"],
    "certifications": ["certifications", "certificates", "licenses"],
    "achievements": ["achievements", "awards", "honors"],
    "publications": ["publications"],
    "volunteering": ["volunteering", "volunteer experience"],
}


def _canonical_section_name(line: str) -> Optional[str]:
    normalized = re.sub(r"[^a-z ]", "", line.lower()).strip()
    if not normalized:
        return None
    for canonical, aliases in SECTION_ALIASES.items():
        for alias in aliases:
            if normalized == alias or normalized.startswith(f"{alias} "):
                return canonical
    return None


def split_sections(text: str) -> Dict[str, List[str]]:
    if not text:
        return {}

    sections: Dict[str, List[str]] = {}
    current = "other"
    sections[current] = []

    for raw_line in text.splitlines():
        line = _clean_line(raw_line)
        if not line:
            continue

        section_name = None
        # Most headers are short. This avoids false positives on sentence lines.
        if len(line) <= 48:
            section_name = _canonical_section_name(line)

        if section_name:
            current = section_name
            sections.setdefault(current, [])
            continue

        sections.setdefault(current, []).append(line)

    # Drop empty sections and dedupe repeated lines in-place.
    filtered: Dict[str, List[str]] = {}
    for key, values in sections.items():
        deduped = []
        seen = set()
        for value in values:
            if value not in seen:
                seen.add(value)
                deduped.append(value)
        if deduped:
            filtered[key] = deduped

    return filtered

def clean_text(text: str):
    if not text:
        return ""
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()
