'use client'
import Lnavbar from '@/components/Lnavbar';
import React, { useState } from 'react';

const Parser = () => {
  const [fileName, setFileName] = useState('');
  const [sections, setSections] = useState<Record<string, string[]> | null>(null);


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
      
     const data = await res.json();
     console.log(data);
     if (!res.ok) {
        console.error("Server error:", data); 
        throw new Error('Failed to parse resume');
      }
      setSections(data.sections); 
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
        className="cursor-pointer px-10 py-4 bg-blue-700 text-white rounded hover:bg-blue-900 "
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
    <div className='m-10 text-left'>
      {sections &&
    Object.entries(sections).map(([heading, content]) => (
    <div key={heading} >
      <h2>{heading}</h2>
       <div className="bg-gray-50 rounded-xl text-black p-3 space-y-1">
          {content.map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
    </div>
  ))}
  </div>
    </div>
    </>
  );
};

export default Parser;
