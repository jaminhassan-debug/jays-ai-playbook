"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"

const categories = [
  { value: "content", label: "Content Creation" },
  { value: "marketing", label: "Marketing" },
  { value: "automation", label: "Automation" },
  { value: "agents", label: "AI Agents" },
  { value: "monetization", label: "Monetization" },
]

export default function NewPromptPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState({
    title: "",
    description: "",
    prompt_text: "",
    category: "content",
    is_premium: false,
  })

  const handleSave = async () => {
    if (!prompt.title || !prompt.prompt_text) return
    
    setLoading(true)
    const supabase = createClient()
    
    const { error } = await supabase.from("prompts").insert(prompt)

    if (error) {
      console.error("Save error:", error)
      setLoading(false)
    } else {
      router.push("/admin/prompts")
      router.refresh()
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/prompts">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add New Prompt</h1>
          <p className="text-sm text-muted-foreground">
            Add a prompt to your public library
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="glass rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="E.g., Viral Hook Generator"
            value={prompt.title}
            onChange={(e) => setPrompt({ ...prompt, title: e.target.value })}
            className="bg-input border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Brief description of what this prompt does"
            value={prompt.description}
            onChange={(e) => setPrompt({ ...prompt, description: e.target.value })}
            className="bg-input border-border"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={prompt.category}
              onChange={(e) => setPrompt({ ...prompt, category: e.target.value })}
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
            <Label>Access Level</Label>
            <div className="flex items-center gap-4 h-10">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="access"
                  checked={!prompt.is_premium}
                  onChange={() => setPrompt({ ...prompt, is_premium: false })}
                  className="accent-primary"
                />
                <span className="text-sm">Free</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="access"
                  checked={prompt.is_premium}
                  onChange={() => setPrompt({ ...prompt, is_premium: true })}
                  className="accent-primary"
                />
                <span className="text-sm">Premium</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="prompt_text">Prompt Text</Label>
          <Textarea
            id="prompt_text"
            placeholder="Enter the full prompt text here..."
            value={prompt.prompt_text}
            onChange={(e) => setPrompt({ ...prompt, prompt_text: e.target.value })}
            className="bg-input border-border min-h-[200px] font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Use [brackets] for user input placeholders, e.g., [topic], [audience]
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <Link href="/admin/prompts">
            <Button variant="outline" className="border-border hover:bg-card">
              Cancel
            </Button>
          </Link>
          <Button
            onClick={handleSave}
            disabled={loading || !prompt.title || !prompt.prompt_text}
            className="gradient-primary text-primary-foreground border-0"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Prompt
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
