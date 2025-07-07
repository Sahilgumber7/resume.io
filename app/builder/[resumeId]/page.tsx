'use client';

import { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { ResumeData } from '@/types/resume';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import html2pdf from 'html2pdf.js';

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
  const { resumeId } = useParams();
  const router = useRouter();

  const [resumeData, setResumeData] = useState<ResumeData>(defaultData);
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'saved'>('loading');

  const previewRef = useRef<HTMLDivElement>(null);

  // ✅ Fetch resume if ID exists
  useEffect(() => {
    const fetchResume = async () => {
      if (resumeId === 'new') {
        setStatus('idle');
        return;
      }

      setStatus('loading');
      try {
        const res = await fetch(`/api/resumes/${resumeId}`);
        if (!res.ok) throw new Error('Failed to fetch resume');
        const data = await res.json();
        setResumeData(data.content); // Assuming your resume doc is { content: ResumeData }
        setStatus('idle');
      } catch (err) {
        console.error('Error loading resume:', err);
        router.push('/dashboard');
      }
    };

    fetchResume();
  }, [resumeId]);

  // ✅ Auto-save changes
  useEffect(() => {
    if (!isSignedIn || resumeId === 'new') return;
    const timeout = setTimeout(() => {
      saveResume();
    }, 1500);
    return () => clearTimeout(timeout);
  }, [resumeData]);

  const saveResume = async () => {
    if (!isSignedIn || resumeId === 'new') return;
    setStatus('saving');
    try {
      await fetch(`/api/resumes/${resumeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: resumeData }),
      });
      setStatus('saved');
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleDownload = () => {
    if (!previewRef.current) return;
    html2pdf()
      .set({
        margin: 0,
        filename: `${resumeData.name || 'resume'}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      })
      .from(previewRef.current)
      .save();
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <div className="pt-[64px] h-[calc(100vh)] flex">
        <div className="w-full lg:w-1/2 h-full overflow-y-auto p-4 bg-background shadow-md">
          <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
          {isSignedIn && resumeId !== 'new' && (
            <div className="text-sm mt-2 text-muted-foreground">
              {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved' : ''}
            </div>
          )}
        </div>

        <div className="hidden lg:block w-px bg-border" />

        <div className="w-full lg:w-1/2 h-full bg-background shadow-md overflow-hidden">
          <div ref={previewRef} className="h-full overflow-auto">
            <ResumePreview resumeData={resumeData} />
          </div>
        </div>
      </div>

      {/* Save/Download bar */}
      <div className="fixed bottom-4 right-4 flex gap-2 z-50">
        <Button onClick={handleDownload} variant="outline">
          Download PDF
        </Button>
      </div>
    </div>
  );
}
