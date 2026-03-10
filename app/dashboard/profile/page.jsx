'use client'

import { useEffect, useState } from 'react'
import { RedirectToSignIn, useUser } from '@clerk/nextjs'
import {
  BriefcaseBusiness,
  FolderGit2,
  GraduationCap,
  Import,
  LoaderCircle,
  Save,
} from 'lucide-react'
import { toast } from 'sonner'

import { GitHubBrandIcon, LinkedInBrandIcon } from '@/components/BrandIcons'
import Lnavbar from '@/components/Lnavbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const toPrettyJson = (value) => JSON.stringify(value || [], null, 2)

export default function ProfilePage() {
  const { isSignedIn, user } = useUser()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)

  const [linkedInUrl, setLinkedInUrl] = useState('')
  const [githubUsername, setGithubUsername] = useState('')
  const [linkedInRaw, setLinkedInRaw] = useState('')
  const [experienceJson, setExperienceJson] = useState('[]')
  const [educationJson, setEducationJson] = useState('[]')
  const [projectsJson, setProjectsJson] = useState('[]')

  const parseArray = (value) => {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const experienceCount = parseArray(experienceJson).length
  const educationCount = parseArray(educationJson).length
  const projectsCount = parseArray(projectsJson).length

  const loadProfile = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/profile', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to load profile')

      setLinkedInUrl(data.linkedInUrl || '')
      setGithubUsername(data.githubUsername || '')
      setExperienceJson(toPrettyJson(data.experience))
      setEducationJson(toPrettyJson(data.education))
      setProjectsJson(toPrettyJson(data.projects))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load profile'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isSignedIn) {
      void loadProfile()
    }
  }, [isSignedIn])

  const importFromLinkedIn = async () => {
    setImporting(true)
    try {
      const res = await fetch('/api/profile/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'linkedin',
          linkedInUrl,
          linkedInRaw,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'LinkedIn import failed')
      const c = data?.importedCounts || {}
      toast.success(`LinkedIn imported: ${c.experience || 0} experience, ${c.education || 0} education, ${c.projects || 0} projects`)
      await loadProfile()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'LinkedIn import failed'
      toast.error(message)
    } finally {
      setImporting(false)
    }
  }

  const saveLinkedInUrl = async () => {
    if (!linkedInUrl.trim()) {
      toast.error('Enter a LinkedIn profile URL first')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedInUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to save LinkedIn URL')
      toast.success('LinkedIn URL saved to profile')
      await loadProfile()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save LinkedIn URL'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const importFromGithub = async () => {
    if (!githubUsername.trim()) {
      toast.error('Enter GitHub username or profile URL')
      return
    }

    setImporting(true)
    try {
      const res = await fetch('/api/profile/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'github',
          githubUsername,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'GitHub import failed')
      const c = data?.importedCounts || {}
      toast.success(`GitHub imported: ${c.experience || 0} experience, ${c.education || 0} education, ${c.projects || 0} projects`)
      await loadProfile()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'GitHub import failed'
      toast.error(message)
    } finally {
      setImporting(false)
    }
  }

  const onSave = async () => {
    setSaving(true)
    try {
      const experience = JSON.parse(experienceJson)
      const education = JSON.parse(educationJson)
      const projects = JSON.parse(projectsJson)

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkedInUrl,
          githubUsername,
          experience,
          education,
          projects,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to save profile data')
      toast.success('Profile data saved')
      await loadProfile()
    } catch (error) {
      const message =
        error instanceof SyntaxError
          ? 'JSON is invalid in one of the sections.'
          : error instanceof Error
            ? error.message
            : 'Failed to save profile data'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Lnavbar />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:pl-24 sm:px-6 lg:px-10">
        <section className="surface-panel p-6">
          <h1 className="text-2xl font-semibold sm:text-3xl">Profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Keep your profile data in one place and reuse it across resumes.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border px-3 py-1">{user?.fullName || 'User'}</span>
            <span className="rounded-full border px-3 py-1">{user?.primaryEmailAddress?.emailAddress || 'No email'}</span>
            <span className="rounded-full border px-3 py-1">Experience: {experienceCount}</span>
            <span className="rounded-full border px-3 py-1">Education: {educationCount}</span>
            <span className="rounded-full border px-3 py-1">Projects: {projectsCount}</span>
          </div>
        </section>

        {loading ? (
          <div className="flex h-40 items-center justify-center rounded-lg border bg-card">
            <LoaderCircle className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            <section className="surface-panel p-6">
              <h2 className="text-xl font-semibold">Integrations</h2>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="surface-card p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <LinkedInBrandIcon className="h-5 w-5" />
                    <p className="text-sm font-semibold">LinkedIn</p>
                  </div>
                  <div className="space-y-3">
                    <Input
                      value={linkedInUrl}
                      onChange={(e) => setLinkedInUrl(e.target.value)}
                      placeholder="LinkedIn profile URL"
                    />
                    <Button onClick={saveLinkedInUrl} disabled={saving}>
                      {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Save LinkedIn URL
                    </Button>
                  </div>
                </div>

                <div className="surface-card p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <GitHubBrandIcon className="h-5 w-5" />
                    <p className="text-sm font-semibold">GitHub</p>
                  </div>
                  <div className="space-y-3">
                    <Input
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      placeholder="GitHub username or URL"
                    />
                    <Button onClick={importFromGithub} disabled={importing}>
                      {importing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Import className="mr-2 h-4 w-4" />}
                      Sync GitHub
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <section className="surface-panel p-6">
              <h2 className="text-xl font-semibold">LinkedIn Extractor</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Paste profile export text or JSON and import it directly.
              </p>
              <div className="mt-4 surface-card p-4">
                <Textarea
                  value={linkedInRaw}
                  onChange={(e) => setLinkedInRaw(e.target.value)}
                  className="min-h-40"
                  placeholder="Paste LinkedIn profile text/JSON export"
                />
                <Button onClick={importFromLinkedIn} disabled={importing} className="mt-3">
                  {importing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Import className="mr-2 h-4 w-4" />}
                  Import LinkedIn Data
                </Button>
              </div>
            </section>

            <section className="surface-panel p-6">
              <h2 className="text-xl font-semibold">Structured Profile Data</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Edit JSON directly if needed.
              </p>
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="surface-card p-4">
                  <label className="mb-2 inline-flex items-center text-sm font-semibold">
                    <BriefcaseBusiness className="mr-2 h-4 w-4" />
                    Experience
                  </label>
                  <Textarea
                    value={experienceJson}
                    onChange={(e) => setExperienceJson(e.target.value)}
                    className="mt-1 min-h-72 font-mono text-xs"
                  />
                </div>
                <div className="surface-card p-4">
                  <label className="mb-2 inline-flex items-center text-sm font-semibold">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Education
                  </label>
                  <Textarea
                    value={educationJson}
                    onChange={(e) => setEducationJson(e.target.value)}
                    className="mt-1 min-h-72 font-mono text-xs"
                  />
                </div>
                <div className="surface-card p-4">
                  <label className="mb-2 inline-flex items-center text-sm font-semibold">
                    <FolderGit2 className="mr-2 h-4 w-4" />
                    Projects
                  </label>
                  <Textarea
                    value={projectsJson}
                    onChange={(e) => setProjectsJson(e.target.value)}
                    className="mt-1 min-h-72 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Button onClick={onSave} disabled={saving}>
                  {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Profile Data
                </Button>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  )
}
