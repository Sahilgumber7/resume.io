"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, FileText, ArrowRight } from "lucide-react"
import Image from "next/image"
import Lnavbar from "@/components/Lnavbar"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function Home() {
  const router = useRouter()

  // Variants for animations
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  return (
    <main className="bg-background text-foreground font-sans">
      <Lnavbar />

      {/* Hero Section */}
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

      {/* Features */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FileText className="w-10 h-10 text-primary" />,
              title: "ATS Friendly",
              desc: "Our templates are optimized to pass Applicant Tracking Systems seamlessly.",
            },
            {
              icon: <CheckCircle className="w-10 h-10 text-primary" />,
              title: "Easy to Use",
              desc: "A clean, intuitive editor to create your resume without hassle.",
            },
            {
              icon: <ArrowRight className="w-10 h-10 text-primary" />,
              title: "Instant Download",
              desc: "Download your resume instantly as a professional PDF.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-background/70 backdrop-blur-lg border border-border/50 shadow-md hover:shadow-xl transition rounded-3xl">
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center">{feature.icon}</div>
                  <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Templates */}
      <section className="py-28 bg-background max-w-6xl mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6"
          initial="hidden"
          whileInView="show"
          variants={fadeUp}
          viewport={{ once: true }}
        >
          Modern Resume Templates
        </motion.h2>
        <motion.p
          className="text-muted-foreground mb-12"
          initial="hidden"
          whileInView="show"
          variants={fadeUp}
          viewport={{ once: true }}
        >
          Professionally designed for every industry. Pick a template and make it yours.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((num, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-3xl shadow-lg hover:scale-105 transition bg-white dark:bg-zinc-900"
            >
              <Image
                src={`/template${num}.png`}
                alt={`Template ${num}`}
                width={400}
                height={600}
                className="w-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
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

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-muted-foreground bg-muted/40">
        <p>&copy; {new Date().getFullYear()} Resume.io. All rights reserved.</p>
      </footer>
    </main>
  )
}
