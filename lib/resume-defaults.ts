type ResumePayloadUser = {
  id?: string
  fullName?: string
  primaryEmailAddress?: {
    emailAddress?: string
  }
}

export function createDefaultResumePayload(title: string, user?: ResumePayloadUser | null) {
  return {
    title: title.trim(),
    userClerkId: user?.id || null,
    fullName: user?.fullName || '',
    jobTitle: '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    phone: '',
    address: '',
    themeColor: '#111827',
    summary: '',
    education: [],
    experience: [],
    skills: [],
    projects: [],
    sectionVisibility: {
      education: true,
      experience: true,
      projects: true,
    },
  }
}
