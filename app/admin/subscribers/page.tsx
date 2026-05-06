import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Users, Download, Mail } from "lucide-react"

export default async function SubscribersAdminPage() {
  const supabase = await createClient()

  const { data: subscribers } = await supabase
    .from("email_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Subscribers</h1>
          <p className="text-muted-foreground">
            {subscribers?.length || 0} subscribers collected
          </p>
        </div>
        <Button variant="outline" className="border-border hover:bg-card">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Subscribers Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {subscribers && subscribers.length > 0 ? (
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="border-b border-border last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <span>{subscriber.email}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(subscriber.subscribed_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No subscribers yet</h3>
            <p className="text-sm text-muted-foreground">
              Subscribers from your email signup forms will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
