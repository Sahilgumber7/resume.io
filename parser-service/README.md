# Resume Parser & ATS Analyzer Service

A modular FastAPI service for parsing resumes (PDF/DOCX) and analyzing them against job descriptions using heuristic scoring and Groq AI.

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Download NLTK & SpaCy models:**
   ```bash
   python -m spacy download en_core_web_sm
   ```

3. **Environment Variables:**
   Create a `.env` file or update `.env.local` with:
   ```env
   GROQ_API_KEY=your_key_here
   ```

## Running the Service

Start the server using `uvicorn`:
```bash
python app.py
```
Or:
```bash
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

- `POST /api/v1/parse`: Extract text and data from a resume file.
- `POST /api/v1/ats-test`: Comprehensive analysis (Heuristic + AI) against a job description.
- `POST /api/v1/analyze`: AI-only analysis of resume text.
- `POST /api/v1/rephrase`: Optimize specific bullet points for ATS.

## Project Structure

- `app/api/`: API route definitions.
- `app/services/`: Core logic (Parser, ATS, AI).
- `app/core/`: Configuration and settings.
- `app/utils/`: Helper functions for text processing.
