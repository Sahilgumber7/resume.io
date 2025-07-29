'use client';
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import AddResume from '@/components/AddResume';
import ResumeCardItem from '@/components/ResumeCardItem';
import axios from 'axios';

function Dashboard() {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState([]);

  const GetResumesList = async () => {
    try {
      const res = await axios.get('/api/resumes'); // ✅ removed query param
      console.log('Fetched resumes:', res.data);
      setResumeList(res.data || []);
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
    }
  };

  useEffect(() => {
    if (user) GetResumesList();
  }, [user]);

  return (
    <div className='p-10 md:px-20 lg:px-32'>
      <h2 className='font-bold text-3xl'>My Resume</h2>
      <p>Start creating AI resume for your next job role</p>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10'>
        <AddResume />
        {resumeList.length > 0
          ? resumeList.map((resume, index) => (
              <ResumeCardItem
                resume={resume}
                key={index}
                refreshData={GetResumesList}
              />
            ))
          : [1, 2, 3, 4].map((item, index) => (
              <div
                key={index}
                className='h-[280px] rounded-lg bg-slate-200 animate-pulse'
              />
            ))}
      </div>
    </div>
  );
}

export default Dashboard;
