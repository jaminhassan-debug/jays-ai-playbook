import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { createClient } from "@/lib/supabase/server"
import { PromptsLibrary } from "@/components/prompts/prompts-library"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Prompts Library",
  description: "Browse our collection of battle-tested AI prompts for content creation, marketing, automation, and more.",
}

export default async function PromptsPage() {
  const supabase = await createClient()
  
  const { data: prompts } = await supabase
    .from("prompts")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="gradient-text">AI Prompts Library</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Copy-paste ready prompts to supercharge your content creation, marketing, and automation workflows.
            </p>
          </div>

          <PromptsLibrary initialPrompts={prompts || []} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
