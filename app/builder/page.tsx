'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { ResumeData } from '@/types/resume';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';

const defaultData: ResumeData = {
  name: '',
  email: '',
  phone: '',
  website: '',
  location: '',
  summary: '',
  experience: [],
  education: [],
  projects: [],
  skills: [],
  featuredSkills: [],
  customSection: {
    title: '',
    content: '',
  },
  settings: {
    font: 'Roboto',
    fontSize: 'Standard',
    themeColor: '#000000',
    documentSize: 'A4',
  },
};

export default function ResumeBuilderPage() {
  const { user, isSignedIn } = useUser();
  const [resumeData, setResumeData] = useState<ResumeData>(defaultData);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Auto-save
  useEffect(() => {
    if (!isSignedIn || !resumeData) return;
    const timeout = setTimeout(() => {
      saveResume();
    }, 1500);
    return () => clearTimeout(timeout);
  }, [resumeData]);

  const saveResume = async () => {
    if (!isSignedIn) return;
    setStatus('saving');

    try {
      const res = await fetch(resumeId ? `/api/resumes/${resumeId}` : `/api/resumes`, {
        method: resumeId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled Resume', content: resumeData }),
      });

      const data = await res.json();
      if (!resumeId && data._id) setResumeId(data._id);
      if (!resumeId && data.resume?._id) setResumeId(data.resume._id);
      setStatus('saved');
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Layout */}
      <div className="pt-[64px] h-[calc(100vh)] flex">
        {/* Editor */}
        <div className="w-full lg:w-1/2 h-full overflow-y-auto p-4 bg-background shadow-md">
          <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-border" />

        {/* Preview */}
        <div className="w-full lg:w-1/2 h-full bg-background shadow-md overflow-hidden">
          <ResumePreview resumeData={resumeData} />
        </div>
      </div>
    </div>
  );
}
