// app/context/ResumeInfoContext.jsx
'use client'
import { createContext, useContext, useState } from 'react'

const ResumeInfoContext = createContext()

export function ResumeInfoProvider({ children }) {
  const [resumeInfo, setResumeInfo] = useState({})

  const updateField = (key, value) => {
    setResumeInfo(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo, updateField }}>
      {children}
    </ResumeInfoContext.Provider>
  )
}

export const useResumeInfo = () => useContext(ResumeInfoContext)
