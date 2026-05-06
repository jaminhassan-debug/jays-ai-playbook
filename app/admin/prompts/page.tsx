import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus, Sparkles, Edit, Lock } from "lucide-react"
import Link from "next/link"

export default async function PromptsAdminPage() {
  const supabase = await createClient()

  const { data: prompts } = await supabase
    .from("prompts")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prompts Library</h1>
          <p className="text-muted-foreground">
            Manage the public prompts library.
          </p>
        </div>
        <Link href="/admin/prompts/new">
          <Button className="gradient-primary text-primary-foreground border-0">
            <Plus className="h-4 w-4 mr-2" />
            Add Prompt
          </Button>
        </Link>
      </div>

      {/* Prompts Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {prompts && prompts.length > 0 ? (
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">Title</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Category</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Access</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {prompts.map((prompt) => (
                <tr key={prompt.id} className="border-b border-border last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{prompt.title}</p>
                        {prompt.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {prompt.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary/20 text-secondary capitalize">
                      {prompt.category}
                    </span>
                  </td>
                  <td className="p-4">
                    {prompt.is_premium ? (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent/20 text-accent flex items-center gap-1 w-fit">
                        <Lock className="h-3 w-3" />
                        Premium
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        Free
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(prompt.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end">
                      <Link href={`/admin/prompts/${prompt.id}`}>
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
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No prompts yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add prompts to your public library.
            </p>
            <Link href="/admin/prompts/new">
              <Button className="gradient-primary text-primary-foreground border-0">
                <Plus className="h-4 w-4 mr-2" />
                Add Prompt
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
