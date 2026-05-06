import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, User } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: article } = await supabase
    .from("articles")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!article) {
    return { title: "Article Not Found" }
  }

  return {
    title: article.title,
    description: article.excerpt || undefined,
  }
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/20 text-primary capitalize">
                {article.category?.replace("-", " ")}
              </span>
              {article.published_at && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(article.published_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </header>

          {/* Article Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div 
              className="[&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:mb-4 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>li]:mb-2 [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-muted-foreground [&>code]:bg-muted [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>pre]:bg-muted [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto"
              dangerouslySetInnerHTML={{ 
                __html: article.content
                  .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                  .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                  .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/`(.*?)`/g, '<code>$1</code>')
                  .replace(/\n/g, '<br/>')
              }}
            />
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="glass rounded-2xl p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Want More AI Tips?</h3>
              <p className="text-muted-foreground mb-4">
                Get weekly prompts, playbooks, and strategies delivered to your inbox.
              </p>
              <Link 
                href="/#subscribe"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg gradient-primary text-primary-foreground font-medium transition-all hover:opacity-90"
              >
                Subscribe for Free
              </Link>
            </div>
          </footer>
        </article>
      </main>
      <Footer />
    </div>
  )
}
