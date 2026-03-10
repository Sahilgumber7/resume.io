'use client'

export default function FormCard({ title, description, children }) {
  return (
    <section className="surface-card p-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      {description ? (
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      ) : null}
      {children}
    </section>
  )
}
