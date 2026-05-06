"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Clock } from "lucide-react"

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  category: string
  image_url: string | null
  published_at: string | null
}

const categories = [
  { value: "all", label: "All Posts" },
  { value: "guides", label: "Guides" },
  { value: "tutorials", label: "Tutorials" },
  { value: "case-studies", label: "Case Studies" },
  { value: "playbooks", label: "Playbooks" },
]

// Sample articles for when database is empty
const sampleArticles: Article[] = [
  {
    id: "1",
    title: "How to Build a 6-Figure AI Content Business in 2024",
    slug: "build-ai-content-business",
    excerpt: "Learn the exact steps to turn your AI skills into a profitable content business, from choosing your niche to landing your first clients.",
    category: "guides",
    image_url: null,
    published_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "The Ultimate Guide to ChatGPT Prompt Engineering",
    slug: "chatgpt-prompt-engineering",
    excerpt: "Master the art of prompt engineering with advanced techniques that will 10x your AI output quality and consistency.",
    category: "tutorials",
    image_url: null,
    published_at: "2024-01-12T10:00:00Z",
  },
  {
    id: "3",
    title: "Case Study: How I Made $10K in 30 Days with AI",
    slug: "10k-30-days-ai-case-study",
    excerpt: "A detailed breakdown of my journey from zero to $10K in monthly revenue using AI tools and automation.",
    category: "case-studies",
    image_url: null,
    published_at: "2024-01-10T10:00:00Z",
  },
  {
    id: "4",
    title: "The Complete AI Marketing Automation Playbook",
    slug: "ai-marketing-automation-playbook",
    excerpt: "Set up a fully automated marketing system that generates leads and sales while you sleep using AI agents.",
    category: "playbooks",
    image_url: null,
    published_at: "2024-01-08T10:00:00Z",
  },
]

export function BlogGrid({ articles }: { articles: Article[] }) {
  const posts = articles.length > 0 ? articles : sampleArticles
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredPosts = posts.filter((post) =>
    selectedCategory === "all" || post.category === selectedCategory
  )

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
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

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredPosts.map((article) => (
          <Link
            key={article.id}
            href={`/blog/${article.slug}`}
            className="glass rounded-2xl overflow-hidden hover:glow-primary transition-all duration-300 group"
          >
            {/* Image Placeholder */}
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold gradient-text opacity-50">
                  {article.title.charAt(0)}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/20 text-primary capitalize">
                  {article.category.replace("-", " ")}
                </span>
                {article.published_at && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(article.published_at)}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-semibold mb-2 group-hover:gradient-text transition-all line-clamp-2">
                {article.title}
              </h3>

              {article.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {article.excerpt}
                </p>
              )}

              <span className="inline-flex items-center gap-2 text-sm text-primary group-hover:gap-3 transition-all">
                Read Article
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles found in this category.</p>
        </div>
      )}
    </div>
  )
}
