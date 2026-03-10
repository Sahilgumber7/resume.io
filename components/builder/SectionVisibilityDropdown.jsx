'use client'

import { useContext, useMemo, useState } from 'react'
import { EyeOff, LoaderCircle, SlidersHorizontal } from 'lucide-react'
import { toast } from 'sonner'

import { ResumeInfoContext } from '@/components/ResumeInfoContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const VISIBILITY_KEYS = ['education', 'experience', 'projects']

export default function SectionVisibilityDropdown({ resumeId }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const [saving, setSaving] = useState(false)

  const visibility = useMemo(
    () => ({
      education: resumeInfo?.sectionVisibility?.education !== false,
      experience: resumeInfo?.sectionVisibility?.experience !== false,
      projects: resumeInfo?.sectionVisibility?.projects !== false,
    }),
    [resumeInfo?.sectionVisibility]
  )

  const hiddenCount = VISIBILITY_KEYS.filter((key) => !visibility[key]).length

  const updateVisibility = async (key, checked) => {
    const nextVisibility = {
      ...visibility,
      [key]: checked === true,
    }

    setResumeInfo((prev) => ({
      ...(prev || {}),
      sectionVisibility: nextVisibility,
    }))

    setSaving(true)
    try {
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionVisibility: nextVisibility }),
      })
      if (!res.ok) throw new Error('Failed to update section visibility')
    } catch (error) {
      console.error(error)
      toast.error('Failed to save visibility settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={saving}>
          {saving ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : hiddenCount > 0 ? (
            <EyeOff className="mr-2 h-4 w-4" />
          ) : (
            <SlidersHorizontal className="mr-2 h-4 w-4" />
          )}
          Visible Sections
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Show or Hide Sections</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={visibility.education}
          onCheckedChange={(checked) => updateVisibility('education', checked)}
        >
          Education
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={visibility.experience}
          onCheckedChange={(checked) => updateVisibility('experience', checked)}
        >
          Experience
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={visibility.projects}
          onCheckedChange={(checked) => updateVisibility('projects', checked)}
        >
          Projects
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
