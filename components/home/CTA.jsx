"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function CallToAction() {
  const router = useRouter()

  return (
    <motion.section
      className="relative py-28 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-center px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1),_transparent_60%)] animate-pulse" />
      <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">
        Start Your Resume Today
      </h2>
      <p className="mb-8 text-lg opacity-90 relative z-10">
        Join thousands of job seekers landing their dream jobs faster.
      </p>
      <Button
        size="lg"
        variant="secondary"
        className="text-lg px-10 shadow-xl hover:scale-105 transition relative z-10"
        onClick={() => router.push("/builder")}
      >
        Build My Resume
      </Button>
    </motion.section>
  )
}
