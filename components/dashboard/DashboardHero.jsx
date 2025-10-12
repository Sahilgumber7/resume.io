'use client'

import { motion } from 'framer-motion'

export default function DashboardHero({ name }) {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  return (
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
        Welcome Back, {name || 'User'} 👋
      </motion.h2>
    </section>
  )
}
