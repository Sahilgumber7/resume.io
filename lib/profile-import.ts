export type ImportedExperience = {
  title?: string;
  companyName?: string;
  city?: string;
  state?: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
  worksummary?: string;
};

export type ImportedEducation = {
  degree?: string;
  universityName?: string;
  major?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

export type ImportedProject = {
  title: string;
  description?: string;
};

export type ImportedProfileData = {
  linkedInUrl?: string;
  githubUsername?: string;
  experience: ImportedExperience[];
  education: ImportedEducation[];
  projects: ImportedProject[];
};

type GitHubUserResponse = {
  login: string;
  company: string | null;
  location: string | null;
  bio: string | null;
  html_url: string;
};

type GitHubRepoResponse = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
};

type GitHubErrorResponse = {
  message?: string;
  documentation_url?: string;
};

const dateRangeRegex = /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\d{4})\s*(?:-|–|to)\s*((?:Present|Current|Now)|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\d{4})/i;

function safeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeDateRange(line: string) {
  const match = line.match(dateRangeRegex);
  if (!match) return { startDate: "", endDate: "" };
  const startDate = safeText(match[1]);
  const endRaw = safeText(match[2]);
  return {
    startDate,
    endDate: /present|current|now/i.test(endRaw) ? "" : endRaw,
  };
}

function dedupeByKey<T>(items: T[], keyBuilder: (item: T) => string): T[] {
  const seen = new Set<string>();
  const unique: T[] = [];

  for (const item of items) {
    const key = keyBuilder(item).toLowerCase().trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }

  return unique;
}

export function mergeImportedSection<T>(
  existing: T[],
  incoming: T[],
  keyBuilder: (item: T) => string
) {
  return dedupeByKey([...(existing || []), ...(incoming || [])], keyBuilder);
}

function parseLinkedInJson(payload: Record<string, unknown>): ImportedProfileData {
  const rawExperience = Array.isArray(payload.experience) ? payload.experience : [];
  const rawEducation = Array.isArray(payload.education) ? payload.education : [];
  const rawProjects = Array.isArray(payload.projects) ? payload.projects : [];

  const experience = rawExperience.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      title: safeText(row.title),
      companyName: safeText(row.companyName || row.company),
      city: safeText(row.city || row.location),
      state: safeText(row.state),
      startDate: safeText(row.startDate),
      endDate: safeText(row.endDate),
      currentlyWorking: Boolean(row.currentlyWorking),
      worksummary: safeText(row.worksummary || row.description),
    };
  });

  const education = rawEducation.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      degree: safeText(row.degree),
      universityName: safeText(row.universityName || row.school),
      major: safeText(row.major || row.fieldOfStudy),
      startDate: safeText(row.startDate),
      endDate: safeText(row.endDate),
      description: safeText(row.description),
    };
  });

  const projects = rawProjects
    .map((item) => {
      const row = item as Record<string, unknown>;
      const title = safeText(row.title || row.name);
      if (!title) return null;
      return {
        title,
        description: safeText(row.description),
      };
    })
    .filter(Boolean) as ImportedProject[];

  return {
    linkedInUrl: safeText(payload.linkedInUrl || payload.profileUrl || payload.linkedin),
    experience: dedupeByKey(experience, (x) => `${x.title}|${x.companyName}|${x.startDate}`),
    education: dedupeByKey(education, (x) => `${x.universityName}|${x.degree}|${x.startDate}`),
    projects: dedupeByKey(projects, (x) => x.title),
  };
}

function parseLinkedInText(rawText: string, linkedInUrl?: string): ImportedProfileData {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const experience: ImportedExperience[] = [];
  const education: ImportedEducation[] = [];
  const projects: ImportedProject[] = [];

  for (const line of lines) {
    const cleaned = line.replace(/^[-*•]\s*/, "").trim();
    const lower = cleaned.toLowerCase();
    const { startDate, endDate } = normalizeDateRange(cleaned);

    if (/project|github\.com|built|developed|created/i.test(cleaned)) {
      projects.push({
        title: cleaned.slice(0, 80),
        description: cleaned,
      });
      continue;
    }

    if (
      /university|college|school|bachelor|master|mba|b\.tech|m\.tech|phd|bsc|msc/i.test(
        lower
      )
    ) {
      education.push({
        universityName: cleaned,
        degree: "",
        major: "",
        startDate,
        endDate,
        description: cleaned,
      });
      continue;
    }

    if (/ at /i.test(cleaned) || /engineer|developer|manager|analyst|intern/i.test(lower)) {
      const [titlePart, companyPart] = cleaned.split(/\s+at\s+/i);
      experience.push({
        title: safeText(titlePart) || cleaned,
        companyName: safeText(companyPart),
        startDate,
        endDate,
        currentlyWorking: /present|current|now/i.test(cleaned),
        worksummary: cleaned,
      });
    }
  }

  return {
    linkedInUrl: linkedInUrl ? safeText(linkedInUrl) : undefined,
    experience: dedupeByKey(experience, (x) => `${x.title}|${x.companyName}|${x.startDate}`),
    education: dedupeByKey(education, (x) => `${x.universityName}|${x.degree}|${x.startDate}`),
    projects: dedupeByKey(projects, (x) => x.title),
  };
}

export function parseLinkedInPayload(params: {
  linkedInRaw?: string;
  linkedInUrl?: string;
}): ImportedProfileData {
  const raw = safeText(params.linkedInRaw);
  if (!raw) {
    return { linkedInUrl: safeText(params.linkedInUrl), experience: [], education: [], projects: [] };
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return parseLinkedInJson(parsed);
  } catch {
    return parseLinkedInText(raw, params.linkedInUrl);
  }
}

function normalizeGitHubUsername(input: string): string {
  const raw = safeText(input);
  if (!raw) return "";
  const byUrl = raw.match(/github\.com\/([A-Za-z0-9-]+)/i);
  if (byUrl?.[1]) return byUrl[1];
  return raw.replace(/^@/, "");
}

function buildGitHubHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "resume-io-profile-sync",
  };

  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function parseGitHubError(response: Response, fallback: string) {
  let details = fallback;
  try {
    const data = (await response.json()) as GitHubErrorResponse;
    if (data?.message) {
      details = data.message;
    }
  } catch {
    // ignore parse errors and use fallback
  }

  if (response.status === 403 && details.toLowerCase().includes("rate limit")) {
    return "GitHub API rate limit reached. Add GITHUB_TOKEN in your .env.local and retry.";
  }
  if (response.status === 404) {
    return "GitHub user not found. Check the username or profile URL.";
  }

  return `${fallback}: ${details}`;
}

export async function importFromGitHub(usernameOrUrl: string): Promise<ImportedProfileData> {
  const username = normalizeGitHubUsername(usernameOrUrl);
  if (!username) {
    return { githubUsername: "", experience: [], education: [], projects: [] };
  }

  const headers = buildGitHubHeaders();

  const userRes = await fetch(`https://api.github.com/users/${username}`, {
    headers,
    cache: "no-store",
  });

  if (!userRes.ok) {
    throw new Error(await parseGitHubError(userRes, "Unable to fetch GitHub profile"));
  }

  const reposRes = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=30`,
    {
      headers,
      cache: "no-store",
    }
  );

  if (!reposRes.ok) {
    throw new Error(await parseGitHubError(reposRes, "Unable to fetch GitHub repositories"));
  }

  const ghUser = (await userRes.json()) as GitHubUserResponse;
  const ghRepos = (await reposRes.json()) as GitHubRepoResponse[];

  const preferredRepos = ghRepos.filter((repo) => !repo.fork);
  const reposForImport = (preferredRepos.length ? preferredRepos : ghRepos).slice(0, 12);

  const projects = reposForImport
    .map((repo) => {
      const lang = safeText(repo.language);
      const stars = repo.stargazers_count ? ` | Stars: ${repo.stargazers_count}` : "";
      const desc = safeText(repo.description);
      return {
        title: repo.name,
        description: `${desc}${desc ? " " : ""}[${repo.html_url}]${lang ? ` | Tech: ${lang}` : ""}${stars}`.trim(),
      };
    });

  const experience: ImportedExperience[] = [];
  if (ghUser.company || ghUser.bio) {
    experience.push({
      title: "Open Source Contributor",
      companyName: safeText(ghUser.company) || "GitHub",
      city: safeText(ghUser.location),
      startDate: "",
      endDate: "",
      currentlyWorking: true,
      worksummary: safeText(ghUser.bio) || `Active developer profile: ${ghUser.html_url}`,
    });
  }

  return {
    githubUsername: ghUser.login,
    experience,
    education: [],
    projects: dedupeByKey(projects, (x) => x.title),
  };
}
