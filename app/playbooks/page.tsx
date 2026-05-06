import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Check } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Playbooks",
  description: "Step-by-step guides and strategies to build AI-powered businesses and automate your workflows.",
}

const playbooks = [
  {
    title: "Content Creator Playbook",
    description: "Master AI-powered content creation for social media, blogs, and email marketing.",
    chapters: 12,
    features: [
      "Viral content formulas",
      "Platform-specific strategies",
      "Automation workflows",
      "Monetization paths",
    ],
    color: "from-primary to-secondary",
  },
  {
    title: "AI Business Blueprint",
    description: "Build a profitable AI services business from scratch with proven frameworks.",
    chapters: 15,
    features: [
      "Business model selection",
      "Client acquisition",
      "Pricing strategies",
      "Scaling systems",
    ],
    color: "from-secondary to-accent",
  },
  {
    title: "Automation Master Class",
    description: "Set up AI agents and automated workflows that work 24/7 without you.",
    chapters: 10,
    features: [
      "AI agent setup",
      "Workflow automation",
      "Tool integrations",
      "Monitoring & optimization",
    ],
    color: "from-accent to-primary",
  },
]

export default function PlaybooksPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="gradient-text">AI Playbooks</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive guides with step-by-step strategies to master AI for business and content creation.
            </p>
          </div>

          {/* Playbooks Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {playbooks.map((playbook) => (
              <div
                key={playbook.title}
                className="glass rounded-2xl overflow-hidden hover:glow-primary transition-all duration-300 group"
              >
                {/* Header */}
                <div className={`h-2 bg-gradient-to-r ${playbook.color}`} />
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {playbook.chapters} Chapters
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mb-2 group-hover:gradient-text transition-all">
                    {playbook.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {playbook.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {playbook.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/shop">
                    <Button className="w-full gradient-primary text-primary-foreground border-0">
                      Get Access
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">
                Want All Playbooks + Premium Access?
              </h2>
              <p className="text-muted-foreground mb-6">
                Get lifetime access to all playbooks, courses, and premium prompts with our complete bundle.
              </p>
              <Link href="/shop">
                <Button size="lg" className="gradient-primary text-primary-foreground border-0">
                  View Premium Bundle
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
