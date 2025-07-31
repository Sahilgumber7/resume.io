'use client'

import React, { useContext, useState } from 'react'
import {
  BtnBold, BtnBulletList, BtnClearFormatting, BtnItalic,
  BtnLink, BtnNumberedList, BtnStrikeThrough, BtnStyles,
  BtnUnderline, Editor, EditorProvider, HtmlButton, Separator, Toolbar
} from 'react-simple-wysiwyg'

import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { Button } from '@/components/ui/button'
import { Brain, LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'

const PROMPT = 'position title: {positionTitle} , Depends on position title give me 5-7 bullet points for my experience in resume (Please do not add experience level and No JSON array) , give me result in HTML tags'

export default function RichTextEditor({ onRichTextEditorChange, index, defaultValue }) {
  const [value, setValue] = useState(defaultValue)
  const [loading, setLoading] = useState(false)

  return (
    <div>
      <div className='flex justify-between my-2'>
        <label className='text-xs'>Summary</label>
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          className="flex gap-2 border-primary text-primary"
        >
          {loading ? <LoaderCircle className='animate-spin h-4 w-4' /> : <><Brain className='h-4 w-4' /> Generate from AI</>}
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
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  )
}
