"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function HeroSection() {
  const router = useRouter()

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-primary/10 via-background to-muted/40 py-28 sm:py-40">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent blur-3xl"
        aria-hidden="true"
      />
      <motion.div
        className="mx-auto max-w-5xl px-6 lg:px-8 text-center"
        initial="hidden"
        animate="show"
        variants={fadeUp}
      >
        <motion.h1
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight"
          variants={fadeUp}
        >
          Build a Job-Winning Resume
        </motion.h1>
        <motion.p
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
          variants={fadeUp}
        >
          Stand out from the competition with modern, ATS-friendly templates and an intuitive editor.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          variants={fadeUp}
        >
          <Button
            size="lg"
            className="text-lg px-8 shadow-lg hover:scale-105 transition"
            onClick={() => router.push("/dashboard")}
          >
            Build My Resume
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 hover:bg-primary/10 transition"
          >
            Browse Templates
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
