# Resume Parser & ATS Analyzer Service

A modular FastAPI service for parsing resumes (PDF/DOCX) and analyzing them against job descriptions using heuristic scoring and Groq AI.

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Download NLTK & SpaCy models:**
   ```bash
   # optional for better name extraction:
   python -m spacy download en_core_web_sm
   ```

3. **Environment Variables:**
   Create a `.env` file or update `.env.local` with:
   ```env
   GROQ_API_KEY=your_key_here
   EMBEDDING_BACKEND=hf
   EMBEDDING_MODEL=BAAI/bge-large-en
   HF_API_TOKEN=your_huggingface_token_here
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

## Clean Deploy Strategy (Hugging Face + Render)

Use this split when Render fails due to heavy ML dependencies:

1. Host embeddings/model inference on Hugging Face (remote inference).
2. Keep FastAPI backend on Render (lightweight, no local torch model).

### 1) Hugging Face setup

1. Create a Hugging Face account and token (`Settings -> Access Tokens`).
2. Ensure your embedding model is available (default: `BAAI/bge-large-en`).
3. Keep that token for Render env var `HF_API_TOKEN`.

### 2) Render setup (for `parser-service`)

Use these Render service values:

- Root Directory: `parser-service`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

Set Render environment variables:

- `GROQ_API_KEY=...`
- `EMBEDDING_BACKEND=hf`
- `EMBEDDING_MODEL=BAAI/bge-large-en`
- `HF_API_TOKEN=...`

Optional:

- `MODEL_NAME=llama-3.1-8B-Instant`

### 3) Local heavy-ML mode (optional)

If you still want to run local embeddings outside Render:

```bash
pip install -r requirements.txt -r requirements.local-ml.txt
```

Then set:

```env
EMBEDDING_BACKEND=local
```

## Project Structure

- `app/api/`: API route definitions.
- `app/services/`: Core logic (Parser, ATS, AI).
- `app/core/`: Configuration and settings.
- `app/utils/`: Helper functions for text processing.
