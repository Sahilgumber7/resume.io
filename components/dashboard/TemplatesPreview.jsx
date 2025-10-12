'use client'

import { Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

export default function TemplatesPreview() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={fadeUp}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-3xl font-semibold flex items-center gap-2">
          <Clock className="w-7 h-7 text-primary" /> Templates (Coming Soon)
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-3xl border border-border/50 shadow-md bg-background/70 backdrop-blur-lg hover:shadow-lg transition">
              <CardContent className="h-[280px] flex items-center justify-center text-muted-foreground text-lg">
                Coming Soon
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
