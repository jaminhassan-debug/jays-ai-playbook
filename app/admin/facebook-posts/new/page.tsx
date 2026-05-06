"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Sparkles, Save, Loader2, Copy, Check, RefreshCw } from "lucide-react"
import Link from "next/link"

const postTypes = [
  { value: "engagement", label: "Engagement Post", description: "Questions, polls, and discussion starters" },
  { value: "promotional", label: "Promotional", description: "Product or service promotion" },
  { value: "educational", label: "Educational", description: "Tips, how-tos, and value content" },
  { value: "storytelling", label: "Storytelling", description: "Personal stories and case studies" },
]

export default function NewFacebookPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [postType, setPostType] = useState("engagement")
  const [content, setContent] = useState("")
  const [variations, setVariations] = useState<string[]>([])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setGenerating(true)
    try {
      const response = await fetch("/api/generate/facebook-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, postType }),
      })

      if (!response.ok) throw new Error("Failed to generate")

      const data = await response.json()
      setContent(data.content || "")
      setVariations(data.variations || [])
    } catch (error) {
      console.error("Generation error:", error)
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = async (status: "draft" | "published") => {
    if (!content.trim()) return
    
    setLoading(true)
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase.from("facebook_posts").insert({
      content,
      prompt_used: prompt,
      status,
      author_id: user?.id,
      published_at: status === "published" ? new Date().toISOString() : null,
    })

    if (error) {
      console.error("Save error:", error)
      setLoading(false)
    } else {
      router.push("/admin/facebook-posts")
      router.refresh()
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/facebook-posts">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create Facebook Post</h1>
          <p className="text-sm text-muted-foreground">
            Generate engaging Facebook posts with AI
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Generator Panel */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Post Generator
            </h3>

            <div className="space-y-4">
              {/* Post Type */}
              <div className="space-y-2">
                <Label>Post Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {postTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setPostType(type.value)}
                      className={`p-3 rounded-lg text-left transition-colors ${
                        postType === type.value 
                          ? "bg-primary/20 border-2 border-primary" 
                          : "bg-muted hover:bg-muted/80 border-2 border-transparent"
                      }`}
                    >
                      <p className="font-medium text-sm">{type.label}</p>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt */}
              <div className="space-y-2">
                <Label htmlFor="prompt">Describe your post topic</Label>
                <Textarea
                  id="prompt"
                  placeholder="E.g., Write about the top 5 AI tools everyone should be using in 2024, focusing on productivity and content creation..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-input border-border min-h-[120px]"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generating || !prompt.trim()}
                className="w-full gradient-primary text-primary-foreground border-0"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Post
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Variations */}
          {variations.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Alternative Variations</h3>
              <div className="space-y-3">
                {variations.map((variation, index) => (
                  <button
                    key={index}
                    onClick={() => setContent(variation)}
                    className="w-full p-3 rounded-lg bg-muted hover:bg-muted/80 text-left text-sm transition-colors"
                  >
                    <p className="line-clamp-2">{variation}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Post Preview</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerate}
                disabled={generating || !prompt.trim()}
              >
                <RefreshCw className={`h-4 w-4 ${generating ? "animate-spin" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!content}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-accent" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Textarea
            placeholder="Your generated Facebook post will appear here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-input border-border min-h-[300px] mb-4"
          />

          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <Button
              onClick={() => handleSave("draft")}
              disabled={loading || !content.trim()}
              variant="outline"
              className="flex-1 border-border hover:bg-card"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave("published")}
              disabled={loading || !content.trim()}
              className="flex-1 gradient-primary text-primary-foreground border-0"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save & Mark Ready"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
