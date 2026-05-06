"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, Search, Lock } from "lucide-react"

interface Prompt {
  id: string
  title: string
  description: string | null
  prompt_text: string
  category: string
  is_premium: boolean
}

const categories = [
  { value: "all", label: "All Prompts" },
  { value: "content", label: "Content" },
  { value: "marketing", label: "Marketing" },
  { value: "automation", label: "Automation" },
  { value: "agents", label: "AI Agents" },
  { value: "monetization", label: "Monetization" },
]

// Sample prompts for when database is empty
const samplePrompts: Prompt[] = [
  {
    id: "1",
    title: "Viral Hook Generator",
    description: "Create scroll-stopping hooks that grab attention instantly",
    prompt_text: "Create 10 scroll-stopping hooks for [topic] that use psychological triggers like curiosity gaps, controversy, and social proof. Each hook should be under 15 words and make the reader NEED to keep reading. Format: Number each hook and explain why it works.",
    category: "content",
    is_premium: false,
  },
  {
    id: "2",
    title: "Sales Page Copywriter",
    description: "Write high-converting sales pages using proven frameworks",
    prompt_text: "Write a high-converting sales page for [product/service] targeting [audience]. Use the PAS (Problem-Agitate-Solution) framework. Include: headline, subheadline, problem section, agitation, solution intro, benefits (not features), social proof section, FAQ, and strong CTA. Tone: [professional/casual/urgent]",
    category: "marketing",
    is_premium: false,
  },
  {
    id: "3",
    title: "Email Sequence Builder",
    description: "Design nurture sequences that convert leads to customers",
    prompt_text: "Design a 7-day email nurture sequence for [niche/product] that moves leads from awareness to purchase. For each email include: subject line (with A/B variant), preview text, email body, CTA, and send timing. The sequence should build trust, provide value, and overcome objections naturally.",
    category: "automation",
    is_premium: false,
  },
  {
    id: "4",
    title: "Research Agent Prompt",
    description: "Deploy an AI agent for comprehensive market research",
    prompt_text: "You are a market research analyst. Your task is to analyze [industry/niche] and provide: 1) Top 10 competitors with their strengths/weaknesses, 2) Market size and growth trends, 3) Target customer personas with pain points, 4) Opportunities and gaps in the market, 5) Recommended positioning strategy. Use data-driven insights and cite sources where possible.",
    category: "agents",
    is_premium: true,
  },
  {
    id: "5",
    title: "Content Repurposer",
    description: "Turn one piece of content into 10+ formats",
    prompt_text: "Take this [blog post/video script/podcast] and repurpose it into: 1) Twitter thread (10 tweets), 2) LinkedIn post, 3) Instagram carousel outline (10 slides), 4) YouTube Shorts script, 5) Email newsletter, 6) Pinterest pin descriptions (5), 7) Quote graphics text (5). Maintain the core message while adapting tone and format for each platform.",
    category: "content",
    is_premium: false,
  },
  {
    id: "6",
    title: "Business Model Generator",
    description: "Create monetization strategies for your AI skills",
    prompt_text: "Generate 5 unique business models for monetizing [skill/expertise] using AI tools. For each model include: Business name idea, value proposition, target market, revenue streams, startup costs, tools needed, marketing strategy, and potential monthly revenue. Focus on scalable, low-overhead businesses.",
    category: "monetization",
    is_premium: true,
  },
]

export function PromptsLibrary({ initialPrompts }: { initialPrompts: Prompt[] }) {
  const prompts = initialPrompts.length > 0 ? initialPrompts : samplePrompts
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesCategory = selectedCategory === "all" || prompt.category === selectedCategory
    const matchesSearch = 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className={
                selectedCategory === category.value
                  ? "gradient-primary text-primary-foreground border-0"
                  : "border-border hover:bg-card"
              }
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="grid gap-6">
        {filteredPrompts.map((prompt) => (
          <div
            key={prompt.id}
            className="glass rounded-2xl p-6 hover:glow-primary transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/20 text-primary capitalize">
                    {prompt.category}
                  </span>
                  {prompt.is_premium && (
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent/20 text-accent flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Premium
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold">{prompt.title}</h3>
                {prompt.description && (
                  <p className="text-sm text-muted-foreground mt-1">{prompt.description}</p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(prompt.prompt_text, prompt.id)}
                className="border-border hover:bg-card shrink-0"
              >
                {copiedId === prompt.id ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-accent" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            {/* Prompt Text */}
            <div className="bg-muted/50 rounded-xl p-4">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                {prompt.is_premium 
                  ? prompt.prompt_text.slice(0, 150) + "... [Unlock premium to see full prompt]"
                  : prompt.prompt_text
                }
              </pre>
            </div>
          </div>
        ))}

        {filteredPrompts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No prompts found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
