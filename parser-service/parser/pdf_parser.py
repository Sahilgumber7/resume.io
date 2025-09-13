import fitz  # PyMuPDF
from . import utils

def parse(path):
    text = ""
    pdf = fitz.open(path)
    for page in pdf:
        text += page.get_text("text")

    return {
        "name": utils.extract_name(text),
        "email": utils.extract_email(text),
        "phone": utils.extract_phone(text),
        "links": utils.extract_links(text),
        "sections": utils.split_sections(text),
    }
