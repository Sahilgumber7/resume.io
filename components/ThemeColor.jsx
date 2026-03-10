'use client'

import { useContext, useMemo, useState } from 'react'
import { LayoutGrid } from 'lucide-react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

import { ResumeInfoContext } from '@/components/ResumeInfoContext'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const COLORS = [
  '#111827',
  '#1D4ED8',
  '#0F766E',
  '#7C3AED',
  '#BE123C',
  '#C2410C',
  '#047857',
  '#334155',
  '#A16207',
  '#6D28D9',
]

export default function ThemeColor() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const params = useParams()
  const resumeId = params?.resumeId
  const [updating, setUpdating] = useState(false)

  const selectedColor = useMemo(
    () => resumeInfo?.themeColor || '#111827',
    [resumeInfo]
  )

  const onColorSelect = async (color) => {
    if (!resumeId || !setResumeInfo) return

    setResumeInfo((prev) => ({
      ...(prev || {}),
      themeColor: color,
    }))

    setUpdating(true)
    try {
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeColor: color }),
      })
      if (!res.ok) throw new Error('Failed to update theme')
      toast.success('Theme updated')
    } catch (err) {
      console.error(err)
      toast.error('Failed to update theme')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" disabled={updating}>
          <LayoutGrid className="mr-2 h-4 w-4" />
          Theme
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <p className="mb-3 text-sm font-medium">Choose Theme Color</p>
        <div className="grid grid-cols-5 gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onColorSelect(color)}
              className={`h-8 w-8 rounded-full border ${
                selectedColor === color ? 'ring-2 ring-primary ring-offset-1' : ''
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select ${color}`}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
