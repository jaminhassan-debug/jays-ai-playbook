import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/sections/hero"
import { Features } from "@/components/sections/features"
import { PromptsPreview } from "@/components/sections/prompts-preview"
import { CTA } from "@/components/sections/cta"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <PromptsPreview />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
