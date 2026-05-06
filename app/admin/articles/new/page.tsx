"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Sparkles, Save, Loader2 } from "lucide-react"
import Link from "next/link"

const categories = [
  { value: "guides", label: "Guides" },
  { value: "tutorials", label: "Tutorials" },
  { value: "case-studies", label: "Case Studies" },
  { value: "playbooks", label: "Playbooks" },
]

export default function NewArticlePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [article, setArticle] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category: "guides",
    status: "draft",
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (title: string) => {
    setArticle({
      ...article,
      title,
      slug: generateSlug(title),
    })
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setGenerating(true)
    try {
      const response = await fetch("/api/generate/article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) throw new Error("Failed to generate")

      const data = await response.json()
      setArticle({
        ...article,
        title: data.title || article.title,
        slug: generateSlug(data.title || article.title),
        content: data.content || "",
        excerpt: data.excerpt || "",
      })
    } catch (error) {
      console.error("Generation error:", error)
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = async (status: "draft" | "published") => {
    if (!article.title || !article.content) return
    
    setLoading(true)
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase.from("articles").insert({
      ...article,
      status,
      author_id: user?.id,
      published_at: status === "published" ? new Date().toISOString() : null,
    })

    if (error) {
      console.error("Save error:", error)
      setLoading(false)
    } else {
      router.push("/admin/articles")
      router.refresh()
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/articles">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create New Article</h1>
          <p className="text-sm text-muted-foreground">
            Use AI to generate or write your article manually
          </p>
        </div>
      </div>

      {/* AI Generator */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Article Generator
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Describe the article you want to create</Label>
            <Textarea
              id="prompt"
              placeholder="E.g., Write a comprehensive guide about using ChatGPT for content creation, covering best practices, prompt engineering tips, and common mistakes to avoid..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-input border-border min-h-[100px]"
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            className="gradient-primary text-primary-foreground border-0"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Article
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Article Form */}
      <div className="glass rounded-2xl p-6 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Article title"
              value={article.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="bg-input border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              placeholder="article-slug"
              value={article.slug}
              onChange={(e) => setArticle({ ...article, slug: e.target.value })}
              className="bg-input border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={article.category}
            onChange={(e) => setArticle({ ...article, category: e.target.value })}
            className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            placeholder="Brief summary of the article..."
            value={article.excerpt}
            onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
            className="bg-input border-border"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Article content (supports markdown)..."
            value={article.content}
            onChange={(e) => setArticle({ ...article, content: e.target.value })}
            className="bg-input border-border min-h-[400px] font-mono text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <Button
            onClick={() => handleSave("draft")}
            disabled={loading || !article.title || !article.content}
            variant="outline"
            className="border-border hover:bg-card"
          >
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </Button>
          <Button
            onClick={() => handleSave("published")}
            disabled={loading || !article.title || !article.content}
            className="gradient-primary text-primary-foreground border-0"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish Article"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
