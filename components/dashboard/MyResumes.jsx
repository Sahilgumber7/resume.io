'use client'

import { FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import AddResume from '@/components/AddResume'
import ResumeCardItem from '@/components/ResumeCardItem'

export default function MyResumes({ resumes, refreshData }) {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  return (
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
          {resumes.length} total
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        <AddResume />
        {resumes.length > 0 ? (
          resumes.map((resume, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <ResumeCardItem resume={resume} refreshData={refreshData} />
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
  )
}
