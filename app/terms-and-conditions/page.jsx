"use client"

import Lnavbar from "@/components/Lnavbar"

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Lnavbar />
      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="surface-panel p-6 sm:p-8">
            <h1 className="text-3xl font-extrabold">Terms &amp; Conditions</h1>
            <p className="mt-2 text-sm text-muted-foreground">Last updated: March 11, 2026</p>

            <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
              <section>
                <h2 className="text-base font-semibold text-foreground">1. Use of Service</h2>
                <p className="mt-1">
                  Resume.xyz provides resume and career tooling for lawful personal and professional use.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground">2. User Content</h2>
                <p className="mt-1">
                  You are responsible for the accuracy and ownership of the content you upload or generate.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground">3. Account Responsibility</h2>
                <p className="mt-1">
                  Keep your login credentials secure. You are responsible for activity on your account.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground">4. Availability</h2>
                <p className="mt-1">
                  We may update, improve, or temporarily suspend features for maintenance and quality.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground">5. Contact</h2>
                <p className="mt-1">
                  Questions about these terms can be sent to support@resume.xyz.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
