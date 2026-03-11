"use client"

import Lnavbar from "@/components/Lnavbar"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Lnavbar />
      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="surface-panel p-6 sm:p-8">
            <h1 className="text-3xl font-extrabold">Contact</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Reach out for support, account issues, or feedback about Resume.xyz.
            </p>

            <div className="mt-6 space-y-4 text-sm leading-relaxed">
              <div className="surface-card p-4">
                <p className="font-semibold">Email Support</p>
                <p className="mt-1 text-muted-foreground">support@resume.xyz</p>
              </div>

              <div className="surface-card p-4">
                <p className="font-semibold">Business Inquiries</p>
                <p className="mt-1 text-muted-foreground">hello@resume.xyz</p>
              </div>

              <div className="surface-card p-4">
                <p className="font-semibold">Response Time</p>
                <p className="mt-1 text-muted-foreground">Usually within 1-2 business days.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
