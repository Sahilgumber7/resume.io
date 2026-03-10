export default function DashboardHero({ name, totalResumes }) {
  return (
    <section className="border-b border-border/60 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Welcome back, {name || 'User'}. You have {totalResumes} resume{totalResumes === 1 ? '' : 's'}.
        </p>
      </div>
    </section>
  )
}
