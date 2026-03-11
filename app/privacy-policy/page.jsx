"use client"

import Lnavbar from "@/components/Lnavbar"

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Lnavbar />
      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="surface-panel p-6 sm:p-8">
            <h1 className="text-3xl font-extrabold">Privacy Policy</h1>
            <p className="mt-2 text-sm text-muted-foreground">Last updated: March 11, 2026</p>

            <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
              <section>
                <h2 className="text-base font-semibold text-foreground">1. Data We Collect</h2>
                <p className="mt-1">
                  We collect account information and the content you provide to deliver resume-related features.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground">2. How We Use Data</h2>
                <p className="mt-1">
                  Data is used to generate resumes, analyses, and cover letters, and to improve service reliability.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground">3. Data Sharing</h2>
                <p className="mt-1">
                  We do not sell your personal data. Limited third-party services may process data to provide core functionality.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground">4. Data Security</h2>
                <p className="mt-1">
                  We use reasonable safeguards to protect your information, but no platform can guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground">5. Contact</h2>
                <p className="mt-1">
                  For privacy questions, contact support@resume.xyz.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
