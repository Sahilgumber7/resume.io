"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function TemplatesSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 text-center">
      <motion.h2
        className="mb-6 text-4xl font-semibold md:text-5xl"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Choose a resume template
      </motion.h2>
      <motion.p
        className="mb-12 text-muted-foreground"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
      >
        Pick a layout and start editing right away.
      </motion.p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[1, 2, 3].map((num, i) => (
          <motion.div
            key={num}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            viewport={{ once: true }}
            className="surface-card overflow-hidden rounded-[1.6rem] transition hover:-translate-y-1"
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
  )
}
