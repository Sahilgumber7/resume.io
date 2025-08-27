'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import AddResume from '@/components/AddResume';
import ResumeCardItem from '@/components/ResumeCardItem';
import axios from 'axios';
import Lnavbar from '@/components/Lnavbar';
import { motion } from 'framer-motion';
import { FileText, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

function Dashboard() {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState([]);

  const GetResumesList = async () => {
    try {
      const res = await axios.get('/api/resumes');
      setResumeList(res.data || []);
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
    }
  };

  useEffect(() => {
    if (user) GetResumesList();
  }, [user]);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <main className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <Lnavbar />

      {/* Hero Header */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-primary/10 via-background to-muted/40 py-20 sm:py-28">
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent blur-3xl"
          aria-hidden="true"
        />
        <motion.h2
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-4xl sm:text-5xl font-extrabold text-center"
        >
          Welcome Back, {user?.firstName || 'User'} 👋
        </motion.h2>
      </section>

      <div className="p-10 md:px-20 lg:px-32">
        {/* My Resumes Section */}
        <motion.section
          className="mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-semibold flex items-center gap-2">
              <FileText className="w-7 h-7 text-primary" /> My Resumes
            </h3>
            <span className="text-muted-foreground text-sm">
              {resumeList.length} total
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            <AddResume />
            {resumeList.length > 0 ? (
              resumeList.map((resume, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <ResumeCardItem resume={resume} refreshData={GetResumesList} />
                </motion.div>
              ))
            ) : (
              [1, 2, 3, 4].map((_, index) => (
                <Card
                  key={index}
                  className="h-[280px] rounded-3xl bg-muted/40 border border-border/50 animate-pulse"
                />
              ))
            )}
          </div>
        </motion.section>

        {/* Templates Section */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-semibold flex items-center gap-2">
              <Clock className="w-7 h-7 text-primary" /> Templates (Coming Soon)
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="rounded-3xl border border-border/50 shadow-md bg-background/70 backdrop-blur-lg hover:shadow-lg transition">
                  <CardContent className="h-[280px] flex items-center justify-center text-muted-foreground text-lg">
                    Coming Soon
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </main>
  );
}

export default Dashboard;
