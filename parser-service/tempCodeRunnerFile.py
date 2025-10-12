import pandas as pd

# Load CSVs (without sep='\t' unless it's actually tab-separated)
resumes = pd.read_csv("/Users/nidhirawat/Projects/projects/Resume/resume.io/parser-service/Resume/Resume.csv", on_bad_lines='skip')
jds = pd.read_csv("/Users/nidhirawat/Projects/projects/Resume/resume.io/parser-service/job_title_des.csv", on_bad_lines='skip')

# Inspect column names
print("Resume columns:", resumes.columns)
print("JD columns:", jds.columns)

# Correct column names based on your CSV
resume_text_col = 'Resume_str'         
jd_text_col = 'Job Description'        

# Preprocess text
resumes['processed_resume'] = resumes[resume_text_col].astype(str).apply(lambda x: x.lower())
jds['processed_jd'] = jds[jd_text_col].astype(str).apply(lambda x: x.lower())

# Generate resume-JD pairs
pairs = []
for _, resume in resumes.iterrows():
    for _, jd in jds.iterrows():
        pairs.append({
            'resume': resume['processed_resume'],
            'job_description': jd['processed_jd']
        })

pairs_df = pd.DataFrame(pairs)
print(pairs_df.head())


from sentence_transformers import SentenceTransformer, util

# Load pre-trained SBERT model
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Example: take first resume and first JD
resume_text = pairs_df.iloc[0]['resume']
jd_text = pairs_df.iloc[0]['job_description']

# Encode them
emb_resume = model.encode(resume_text, convert_to_tensor=True)
emb_jd = model.encode(jd_text, convert_to_tensor=True)

# Compute cosine similarity (this gives ATS match score)
score = util.cos_sim(emb_resume, emb_jd).item()
print(f"Similarity Score (ATS Match): {score:.2f}")
