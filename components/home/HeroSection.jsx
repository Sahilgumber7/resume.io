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
    <section className="relative isolate overflow-hidden py-24 sm:py-36">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-muted via-background to-background"
        aria-hidden="true"
      />
      <motion.div
        className="mx-auto max-w-6xl px-6 text-center lg:px-8"
        initial="hidden"
        animate="show"
        variants={fadeUp}
      >
        <motion.h1
          className="mx-auto max-w-4xl text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl"
          variants={fadeUp}
        >
          Build your resume in minutes.
        </motion.h1>
        <motion.p
          className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-xl"
          variants={fadeUp}
        >
          Create, edit, and download a clean resume that is ready for ATS.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
          variants={fadeUp}
        >
          <Button
            size="lg"
            className="rounded-full px-8 text-base"
            onClick={() => router.push("/dashboard")}
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 text-base"
            onClick={() => router.push("/dashboard/profile")}
          >
            View Templates
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
