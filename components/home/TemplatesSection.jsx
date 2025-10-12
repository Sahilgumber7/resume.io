"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function TemplatesSection() {
  return (
    <section className="py-28 bg-background max-w-6xl mx-auto px-4 text-center">
      <motion.h2
        className="text-4xl md:text-5xl font-bold mb-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Modern Resume Templates
      </motion.h2>
      <motion.p
        className="text-muted-foreground mb-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
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
  )
}
