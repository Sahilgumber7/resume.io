'use client';
import React, { useState } from 'react';
import Lnavbar from '@/components/Lnavbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';

interface Resume {
  name: string | null;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  sections: Record<string, string[]>;
}

const ParserPage: React.FC = () => {
  const [fileName, setFileName] = useState('');
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setFileName(file.name);
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('/api/parser', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || 'Failed to parse resume');

      setResume(data.resume);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Lnavbar />
      <div className="p-10 flex flex-col items-center">
        <input
          id="resumeUpload"
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />

        <label htmlFor="resumeUpload" className="w-full max-w-lg">
          <Button asChild variant="default">
            <span className="flex items-center gap-2 justify-center w-full">
              <Upload className="w-4 h-4" />
              {fileName ? `Uploaded: ${fileName}` : 'Upload Resume'}
            </span>
          </Button>
        </label>

        {loading && <p className="text-blue-600 mt-2">Parsing resume...</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}

        {resume && (
          <div className="mt-10 w-full max-w-3xl space-y-6">
            <Card className="shadow-sm border rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {resume.name && <p><strong>Name:</strong> {resume.name}</p>}
                {resume.email && <p><strong>Email:</strong> {resume.email}</p>}
                {resume.phone && <p><strong>Phone:</strong> {resume.phone}</p>}
                {resume.linkedin && <p><strong>LinkedIn:</strong> {resume.linkedin}</p>}
              </CardContent>
            </Card>

            {Object.entries(resume.sections).map(([heading, content]) => (
              <Card key={heading} className="shadow-sm border rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{heading}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {content.map((line, idx) => (
                    <p key={idx} className="text-sm text-gray-700">{line}</p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ParserPage;
