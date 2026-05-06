import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { createClient } from "@/lib/supabase/server"
import { BlogGrid } from "@/components/blog/blog-grid"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog - AI Guides & Tutorials",
  description: "Learn how to leverage AI for content creation, marketing automation, and building profitable online businesses.",
}

export default async function BlogPage() {
  const supabase = await createClient()
  
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="gradient-text">AI Blog & Guides</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Deep-dive tutorials, case studies, and strategies for mastering AI-powered content and business.
            </p>
          </div>

          <BlogGrid articles={articles || []} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
