'use client'

import React, { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button'
import { LayoutGrid } from 'lucide-react'
import { ResumeInfoContext } from '@/components/ResumeInfoContext'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

function ThemeColor({ resumeInfo, setResumeInfo }) {
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF",
    "#33FFA1", "#FF7133", "#71FF33", "#7133FF", "#FF3371",
    "#33FF71", "#3371FF", "#A1FF33", "#33A1FF", "#FF5733",
    "#5733FF", "#33FF5A", "#5A33FF", "#FF335A", "#335AFF"
  ]

  const [selectedColor, setSelectedColor] = useState(resumeInfo?.themeColor)
  const params = useParams()
  const resumeId = params?.resumeId

  const onColorSelect = async (color) => {
    setSelectedColor(color)
    setResumeInfo({
      ...resumeInfo,
      themeColor: color
    })

    try {
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          themeColor: color
        })
      })

      if (!res.ok) throw new Error('Failed to update')

      toast('Theme Color Updated')
    } catch (err) {
      console.error(err)
      toast.error('Failed to update theme color')
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2">
          <LayoutGrid /> Theme
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <h2 className="mb-2 text-sm font-bold">Select Theme Color</h2>
        <div className="grid grid-cols-5 gap-3">
          {colors.map((item, index) => (
            <div
              key={index}
              onClick={() => onColorSelect(item)}
              className={`h-5 w-5 rounded-full cursor-pointer
                hover:border-black border
                ${selectedColor === item ? 'border-black border-2' : ''}
              `}
              style={{ background: item }}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ThemeColor
