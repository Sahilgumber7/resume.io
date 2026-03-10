'use client'

import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ProfileSectionDropdown({ section, onApply }) {
  const [mode, setMode] = useState('append')
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        setProfileData(data)
      } catch {
        // Silent fail; this feature should not block normal editing.
      }
    }
    fetchProfile()
  }, [])

  const items = useMemo(() => {
    if (!profileData) return []
    if (section === 'experience') return profileData.experience || []
    if (section === 'education') return profileData.education || []
    if (section === 'projects') return profileData.projects || []
    return []
  }, [profileData, section])

  const onApplyClick = async () => {
    if (!items.length) {
      toast.error('No saved profile data found for this section.')
      return
    }
    setLoading(true)
    try {
      onApply(items, mode)
      toast.success(`Applied ${items.length} profile item(s).`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-3 rounded-md border bg-muted/20 p-3">
      <p className="text-xs text-muted-foreground">
        Use saved profile {section} data ({items.length} available)
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Select value={mode} onValueChange={setMode}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="append">Append from profile</SelectItem>
            <SelectItem value="replace">Replace with profile</SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onApplyClick}
          disabled={loading || items.length === 0}
        >
          Apply from Profile
        </Button>
      </div>
    </div>
  )
}
