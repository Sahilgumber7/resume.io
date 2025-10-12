"use client"

import Lnavbar from "@/components/Lnavbar"
import Footer from "@/components/Footer"
import HeroSection from "@/components/home/HeroSection"
import FeaturesSection from "@/components/home/FeaturesSection"
import TemplatesSection from "@/components/home/TemplatesSection"
import CallToAction from "@/components/home/CTA"

export default function Home() {
  return (
    <main className="bg-background text-foreground font-sans">
      <Lnavbar />
      <HeroSection />
      <FeaturesSection />
      <TemplatesSection />
      <CallToAction />
      <Footer />
    </main>
  )
}
