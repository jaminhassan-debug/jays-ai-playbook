import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus, Facebook, Edit, Copy, Eye } from "lucide-react"
import Link from "next/link"

export default async function FacebookPostsAdminPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from("facebook_posts")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Facebook Posts</h1>
          <p className="text-muted-foreground">
            Generate and manage Facebook posts with AI.
          </p>
        </div>
        <Link href="/admin/facebook-posts/new">
          <Button className="gradient-primary text-primary-foreground border-0">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  post.status === "published" 
                    ? "bg-accent/20 text-accent" 
                    : post.status === "scheduled"
                    ? "bg-secondary/20 text-secondary"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {post.status}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-sm line-clamp-4 mb-4">{post.content}</p>

              {post.prompt_used && (
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                  Prompt: {post.prompt_used}
                </p>
              )}

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Link href={`/admin/facebook-posts/${post.id}`}>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full glass rounded-2xl p-12 text-center">
            <Facebook className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Facebook posts yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create AI-powered Facebook posts to engage your audience.
            </p>
            <Link href="/admin/facebook-posts/new">
              <Button className="gradient-primary text-primary-foreground border-0">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
