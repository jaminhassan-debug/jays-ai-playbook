import { Button } from "@/components/ui/button"
import { ArrowRight, Copy, Check } from "lucide-react"
import Link from "next/link"

const samplePrompts = [
  {
    category: "Content",
    title: "Viral Hook Generator",
    preview: "Create 10 scroll-stopping hooks for [topic] that use psychological triggers like curiosity gaps, controversy, and social proof...",
  },
  {
    category: "Marketing",
    title: "Sales Page Writer",
    preview: "Write a high-converting sales page for [product] using the PAS framework. Include emotional triggers, social proof sections...",
  },
  {
    category: "Automation",
    title: "Email Sequence Builder",
    preview: "Design a 7-day email nurture sequence for [niche] that moves leads from awareness to purchase. Include subject lines...",
  },
  {
    category: "Agents",
    title: "Research Assistant",
    preview: "Act as a research analyst. Your task is to find the top 10 competitors in [industry] and analyze their marketing strategies...",
  },
]

export function PromptsPreview() {
  return (
    <section className="py-24 relative bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              <span className="gradient-text">Featured Prompts</span>
            </h2>
            <p className="text-muted-foreground">
              Battle-tested prompts ready to copy and use
            </p>
          </div>
          <Link href="/prompts">
            <Button variant="outline" className="border-border hover:bg-card">
              View All Prompts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Prompts Grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {samplePrompts.map((prompt) => (
            <div
              key={prompt.title}
              className="glass rounded-2xl p-6 hover:glow-primary transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/20 text-primary">
                  {prompt.category}
                </span>
                <button 
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Copy prompt"
                >
                  <Copy className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <h3 className="text-lg font-semibold mb-3 group-hover:gradient-text transition-all">
                {prompt.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {prompt.preview}
              </p>
              <Link 
                href="/prompts" 
                className="inline-flex items-center gap-2 mt-4 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                View Full Prompt
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
