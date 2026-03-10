"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function CallToAction() {
  const router = useRouter()

  return (
    <motion.section
      className="relative mx-auto mb-14 max-w-6xl px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="surface-panel px-6 py-14 text-center sm:px-10">
        <h2 className="relative z-10 mb-6 text-4xl font-semibold md:text-5xl">
          Ready to build your resume?
        </h2>
        <p className="relative z-10 mb-8 text-base text-muted-foreground sm:text-lg">
          Start now and export a professional PDF.
        </p>
        <Button
          size="lg"
          className="relative z-10 rounded-full px-10 text-base"
          onClick={() => router.push("/dashboard")}
        >
          Start Building
        </Button>
      </div>
    </motion.section>
  )
}
