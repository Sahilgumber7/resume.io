"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, FileText, ArrowRight } from "lucide-react"
import Image from "next/image"
import Lnavbar from "@/components/Lnavbar"
import { useRouter } from "next/navigation" // ✅ Import this

export default function Home() {
  const router = useRouter(); // ✅ Router instance

  return (
    <main className="bg-background text-foreground">
      <Lnavbar />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-primary/5 via-background to-muted/40 py-24 sm:py-32">
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
            Create a Job-Winning Resume in Minutes
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Our modern, ATS-friendly templates and intuitive editor help you stand out and get hired faster.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8"
              onClick={() => router.push("/builder")} // ✅ Navigate to builder
            >
              Build My Resume
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Browse Templates
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FileText className="w-8 h-8 text-primary" />,
              title: "ATS Friendly",
              desc: "Our templates are optimized to pass Applicant Tracking Systems.",
            },
            {
              icon: <CheckCircle className="w-8 h-8 text-primary" />,
              title: "Easy to Use",
              desc: "A user-friendly editor to add content and customize templates.",
            },
            {
              icon: <ArrowRight className="w-8 h-8 text-primary" />,
              title: "Instant Download",
              desc: "Export your resume as a PDF instantly with one click.",
            },
          ].map((feature, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Templates */}
      <section className="py-20 bg-background max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Beautiful, Modern Templates
        </h2>
        <p className="text-muted-foreground mb-10">
          Choose from a variety of professional designs tailored for every industry.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((num) => (
            <div key={num} className="overflow-hidden rounded-2xl shadow-lg bg-white dark:bg-zinc-900">
              <Image
                src={`/template${num}.png`}
                alt={`Template ${num}`}
                width={400}
                height={600}
                className="w-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Resume Now</h2>
        <p className="mb-6 text-lg">Join thousands of job seekers getting hired faster.</p>
        <Button
          size="lg"
          variant="secondary"
          className="text-lg px-8"
          onClick={() => router.push("/builder")} // ✅ Another redirect
        >
          Build My Resume
        </Button>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-muted-foreground bg-muted/50">
        <p>&copy; {new Date().getFullYear()} resume.io. All rights reserved.</p>
      </footer>
    </main>
  )
}
