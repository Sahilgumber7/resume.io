"use client"

import Link from "next/link"

const productLinks = [
  { label: "Resume Builder", href: "/dashboard" },
  { label: "ATS Score Matcher", href: "/ats-tester" },
  { label: "LinkedIn Analyzer", href: "/linkedin-analyzer" },
  { label: "Cover Letter", href: "/cover-letter" },
]

const resourceLinks = [
  { label: "Parser", href: "/parser" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "Templates", href: "/dashboard" },
  { label: "Dashboard", href: "/dashboard" },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#07090d] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_48%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Resume.xyz</p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            Build, analyze, and share your resume with confidence.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
            One workspace for resume creation, ATS optimization, LinkedIn improvements, and cover-letter generation.
          </p>
        </div>

        <div className="mt-12 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold">resume.xyz</p>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              A focused resume toolkit designed to help you move faster from draft to interview.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/70">Product</p>
            <div className="mt-3 space-y-2">
              {productLinks.map((link) => (
                <Link key={link.label} href={link.href} className="block text-sm text-white/90 transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/70">Resources</p>
            <div className="mt-3 space-y-2">
              {resourceLinks.map((link) => (
                <Link key={link.label} href={link.href} className="block text-sm text-white/90 transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/70">Legal</p>
            <div className="mt-3 space-y-2 text-sm text-white/90">
              <Link href="/privacy-policy" className="block transition hover:text-white">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="block transition hover:text-white">Terms &amp; Conditions</Link>
              <Link href="/contact" className="block transition hover:text-white">Contact</Link>
              <p>Support: support@resume.xyz</p>
              <p className="pt-2 text-white/60">(c) {new Date().getFullYear()} Resume.xyz</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
