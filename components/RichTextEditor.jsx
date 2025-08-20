'use client'

import React, { useContext, useState } from 'react'
import {
  BtnBold, BtnBulletList, BtnClearFormatting, BtnItalic,
  BtnLink, BtnNumberedList, BtnStrikeThrough, BtnUnderline,
  Editor, EditorProvider, Separator, Toolbar
} from 'react-simple-wysiwyg'

import { ResumeInfoContext } from '@/components/ResumeInfoContext'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'

// ✅ Updated prompt -> use "title"
const PROMPT =
  'position title: {title}, Based on this title give me 2 bullet points for my experience in resume (Please do not add experience level and No JSON array). Give me result in HTML tags but dont include ```html ```.'

export default function RichTextEditor({
  onRichTextEditorChange,
  index,
  defaultValue,
}) {
  const { resumeInfo } = useContext(ResumeInfoContext)
  const [value, setValue] = useState(defaultValue)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    try {
      setLoading(true)
      const exp = resumeInfo?.experience?.[index]
      if (!exp?.title) {
        toast.error('Please enter a job title first')
        return
      }

      const prompt = PROMPT.replace('{title}', exp.title)

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!res.ok) throw new Error('Failed to generate content')

      const data = await res.json()
      setValue(data.output)
      onRichTextEditorChange({ target: { value: data.output } })
    } catch (err) {
      console.error(err)
      toast.error('AI generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-xs">Summary</label>
        <Button
          variant="outline"
          disabled={loading}
          onClick={handleGenerate}
        >
          {loading ? (
            <LoaderCircle className="w-4 h-4 animate-spin" />
          ) : (
            '✨ Generate with AI'
          )}
        </Button>
      </div>

      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            onRichTextEditorChange(e)
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
            <BtnClearFormatting />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  )
}
