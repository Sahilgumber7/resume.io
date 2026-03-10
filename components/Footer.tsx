"use client"

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/80 py-10 text-center text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Resume.io. All rights reserved.</p>

        <div className="flex gap-6 text-muted-foreground">
          <a
            href="#"
            className="transition-colors hover:text-foreground"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="transition-colors hover:text-foreground"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="transition-colors hover:text-foreground"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
