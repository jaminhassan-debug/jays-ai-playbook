import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Facebook, Sparkles, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch counts
  const [articles, fbPosts, prompts, subscribers] = await Promise.all([
    supabase.from("articles").select("id", { count: "exact", head: true }),
    supabase.from("facebook_posts").select("id", { count: "exact", head: true }),
    supabase.from("prompts").select("id", { count: "exact", head: true }),
    supabase.from("email_subscribers").select("id", { count: "exact", head: true }),
  ])

  const stats = [
    {
      label: "Total Articles",
      value: articles.count || 0,
      icon: FileText,
      href: "/admin/articles",
      color: "text-primary",
      bgColor: "bg-primary/20",
    },
    {
      label: "Facebook Posts",
      value: fbPosts.count || 0,
      icon: Facebook,
      href: "/admin/facebook-posts",
      color: "text-secondary",
      bgColor: "bg-secondary/20",
    },
    {
      label: "Prompts",
      value: prompts.count || 0,
      icon: Sparkles,
      href: "/admin/prompts",
      color: "text-accent",
      bgColor: "bg-accent/20",
    },
    {
      label: "Subscribers",
      value: subscribers.count || 0,
      icon: Users,
      href: "/admin/subscribers",
      color: "text-primary",
      bgColor: "bg-primary/20",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="glass hover:glow-primary transition-all duration-300 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Article Generator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Use AI to generate and publish blog articles directly to your website.
            </p>
            <Link 
              href="/admin/articles/new"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              Create New Article
              <TrendingUp className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Facebook className="h-5 w-5 text-secondary" />
              Facebook Post Creator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Generate engaging Facebook posts from prompts for your social media.
            </p>
            <Link 
              href="/admin/facebook-posts/new"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              Create New Post
              <TrendingUp className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
