'use client'
import Lnavbar from '@/components/Lnavbar';
import React, { useState } from 'react';

const Parser = () => {
  const [fileName, setFileName] = useState('');
  const[parsedData,setParsedData]=useState<any>(null);

  const handleFileChange = async (e:any) => {
  if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setFileName(file.name);

    const formData = new FormData();
    formData.append('resume', file); 
       try {
      const res = await fetch('/api/parser', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        throw new Error('Failed to parse resume');
      }
     const data = await res.json();
      setParsedData(data); 
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <>
    <Lnavbar/>
    <div className="p-10 text-center items-center">
      <label
        htmlFor="resumeUpload"
        className="cursor-pointer px-10 py-4 bg-blue-700 text-white rounded hover:bg-blue-900"
      >
        Upload Resume
      </label>
      <input
        id="resumeUpload"
        type="file"
        accept=".pdf,.doc,.docx,.pages"
        onChange={handleFileChange}
        className="hidden"
      />

      {fileName && (
        <p className="mt-10 text-red-700">
          Selected file: <strong>{fileName}</strong>
        </p>
      )}

      {parsedData && (
          <div className="mt-8 text-left bg-gray-100 p-6 rounded-lg shadow-lg w-[80%] mx-auto">
            <h2 className="text-lg font-semibold mb-3">Extracted Information:</h2>
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(parsedData, null, 2)}
            </pre>
          </div>
        )}
    </div>
    </>
  );
};

export default Parser;
