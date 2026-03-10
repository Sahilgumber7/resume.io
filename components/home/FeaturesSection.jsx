"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, CheckCircle, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: <FileText className="w-10 h-10 text-primary" />,
    title: "ATS Friendly",
    desc: "Our templates are optimized to pass Tracking Systems seamlessly.",
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
]

export default function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-3">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="surface-card rounded-[1.6rem] transition hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">{feature.icon}</div>
                <h3 className="mb-3 text-2xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
