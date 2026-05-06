"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Check } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

const benefits = [
  "500+ ready-to-use AI prompts",
  "Weekly new prompts delivered",
  "Exclusive playbooks & guides",
  "Access to private community",
]

export function CTA() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    const supabase = createClient()

    const { error } = await supabase
      .from("email_subscribers")
      .insert({ email })

    if (error) {
      if (error.code === "23505") {
        setStatus("success")
      } else {
        setStatus("error")
      }
    } else {
      setStatus("success")
      setEmail("")
    }
  }

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Ready to Master AI?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of creators, marketers, and entrepreneurs who are using our AI playbooks to 10x their productivity and income.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-accent" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-input border-border"
              required
            />
            <Button 
              type="submit" 
              className="gradient-primary text-primary-foreground border-0"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Joining..." : "Get Free Access"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
          {status === "success" && (
            <p className="text-sm text-accent mt-4">Welcome! Check your email for your free prompts.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-destructive mt-4">Something went wrong. Please try again.</p>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
