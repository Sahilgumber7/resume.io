import os
import fitz  # PyMuPDF
from docx import Document
from app.utils import text_utils

def parse_pdf(file_path: str):
    text = ""
    try:
        doc = fitz.open(file_path)
        for page in doc:
            text += page.get_text()
        doc.close()
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        return None
    return text

def parse_docx(file_path: str):
    try:
        doc = Document(file_path)
        text = "\n".join([para.text for para in doc.paragraphs])
        return text
    except Exception as e:
        print(f"Error parsing DOCX: {e}")
        return None

def extract_resume_data(text: str):
    if not text:
        return {}
    
    return {
        "name": text_utils.extract_name(text),
        "email": text_utils.extract_email(text),
        "phone": text_utils.extract_phone(text),
        "links": text_utils.extract_links(text),
        "sections": text_utils.split_sections(text),
        "raw_text": text
    }

def parse_file(file_path: str):
    suffix = os.path.splitext(file_path)[1].lower()
    text = ""
    
    if suffix == ".pdf":
        text = parse_pdf(file_path)
    elif suffix == ".docx":
        text = parse_docx(file_path)
    else:
        return {"error": "Unsupported file format"}
    
    if text is None:
        return {"error": "Failed to extract text from file"}
        
    return extract_resume_data(text)
