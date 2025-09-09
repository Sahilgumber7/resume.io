'use client';

import Lnavbar from '@/components/Lnavbar';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';

interface Sections {
  [key: string]: string[];
}

const Parser: React.FC = () => {
  const [fileName, setFileName] = useState<string>('');
  const [sections, setSections] = useState<Sections | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setFileName(file.name);
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('/api/parser', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Server error:', data);
        throw new Error(data?.message || 'Failed to parse resume');
      }

      setSections(data.sections || {});
    } catch (err: unknown) {
      console.error('Error uploading file:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Lnavbar />
      <div className="p-10 flex flex-col items-center">
        <Card className="w-full max-w-lg shadow-md">
          <CardContent className="flex flex-col items-center p-6 space-y-4">
            <input
              id="resumeUpload"
              type="file"
              accept=".pdf,.doc,.docx,.pages"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="resumeUpload">
              <Button asChild variant="default" className="flex items-center gap-2">
                <span>
                  <Upload className="w-4 h-4 mr-2" /> 
                  {fileName ? `Uploaded: ${fileName}` : 'Upload Resume'}
                </span>
              </Button>
            </label>

            {loading && <p className="text-blue-600">Parsing resume...</p>}
            {error && <p className="text-red-600">{error}</p>}
          </CardContent>
        </Card>

        <div className="mt-10 w-full max-w-3xl space-y-6">
          {sections ? (
            Object.entries(sections).map(([heading, content]) => (
              <Card key={heading} className="shadow-sm border rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{heading}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {content.map((line, idx) => (
                    <p key={idx} className="text-sm text-gray-700">
                      {line}
                    </p>
                  ))}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              Upload a resume to see parsed sections here.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Parser;
