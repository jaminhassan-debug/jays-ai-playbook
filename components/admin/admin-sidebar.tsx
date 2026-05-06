"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  FileText, 
  Facebook, 
  Sparkles,
  Package,
  Users,
  Settings,
  ExternalLink
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/facebook-posts", label: "FB Posts", icon: Facebook },
  { href: "/admin/prompts", label: "Prompts", icon: Sparkles },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/subscribers", label: "Subscribers", icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-card/50 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Jay's AI Playbook"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <span className="font-bold gradient-text">Admin</span>
            <p className="text-xs text-muted-foreground">Jay&apos;s AI Playbook</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/admin" && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive 
                  ? "bg-primary/20 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          View Site
        </Link>
      </div>
    </aside>
  )
}
