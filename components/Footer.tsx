"use client"

export default function Footer() {
  return (
    <footer className="py-10 text-center text-sm text-muted-foreground bg-muted/40 border-t border-border/40">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} Resume.io. All rights reserved.</p>

        <div className="flex gap-6 text-muted-foreground">
          <a
            href="#"
            className="hover:text-primary transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="hover:text-primary transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="hover:text-primary transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
