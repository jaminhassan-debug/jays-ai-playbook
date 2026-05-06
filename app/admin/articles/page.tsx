import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"

export default async function ArticlesAdminPage() {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Articles</h1>
          <p className="text-muted-foreground">
            Manage your blog articles and publications.
          </p>
        </div>
        <Link href="/admin/articles/new">
          <Button className="gradient-primary text-primary-foreground border-0">
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </Button>
        </Link>
      </div>

      {/* Articles Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {articles && articles.length > 0 ? (
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">Title</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Category</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-border last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{article.title}</p>
                        <p className="text-xs text-muted-foreground">/blog/{article.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary/20 text-secondary capitalize">
                      {article.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      article.status === "published" 
                        ? "bg-accent/20 text-accent" 
                        : article.status === "draft"
                        ? "bg-muted text-muted-foreground"
                        : "bg-destructive/20 text-destructive"
                    }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(article.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/blog/${article.slug}`} target="_blank">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/articles/${article.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No articles yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first AI-generated article to get started.
            </p>
            <Link href="/admin/articles/new">
              <Button className="gradient-primary text-primary-foreground border-0">
                <Plus className="h-4 w-4 mr-2" />
                Create Article
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
