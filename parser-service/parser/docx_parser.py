import docx2txt
from . import utils

def parse(path):
    text = docx2txt.process(path)

    return {
        "name": utils.extract_name(text),
        "email": utils.extract_email(text),
        "phone": utils.extract_phone(text),
        "links": utils.extract_links(text),
        "sections": utils.split_sections(text),
    }
