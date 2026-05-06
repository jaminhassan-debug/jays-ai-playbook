"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Sparkles, Zap, Brain } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function Hero() {
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
        setStatus("success") // Already subscribed
      } else {
        setStatus("error")
      }
    } else {
      setStatus("success")
      setEmail("")
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm">
              <Sparkles className="h-4 w-4 text-accent" />
              <span>Master AI-Powered Content Creation</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="gradient-text">Unlock the Power</span>
              <br />
              <span className="text-foreground">of AI Prompts</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Discover battle-tested prompts, automation playbooks, and monetization strategies that help you create viral content and build a profitable AI-powered business.
            </p>

            {/* Email Signup */}
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md">
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
                {status === "loading" ? "Joining..." : "Get Free Prompts"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            {status === "success" && (
              <p className="text-sm text-accent">Welcome! Check your email for free prompts.</p>
            )}
            {status === "error" && (
              <p className="text-sm text-destructive">Something went wrong. Please try again.</p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold gradient-text">500+</p>
                <p className="text-sm text-muted-foreground">AI Prompts</p>
              </div>
              <div>
                <p className="text-2xl font-bold gradient-text">50+</p>
                <p className="text-sm text-muted-foreground">Playbooks</p>
              </div>
              <div>
                <p className="text-2xl font-bold gradient-text">10K+</p>
                <p className="text-sm text-muted-foreground">Users</p>
              </div>
            </div>
          </div>

          {/* Right Content - Logo & Features */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glowing Logo */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                <div className="absolute inset-0 rounded-full glow-primary animate-pulse" />
                <Image
                  src="/images/logo.png"
                  alt="Jay's AI Playbook"
                  fill
                  className="object-contain rounded-full"
                  priority
                />
              </div>

              {/* Floating Feature Cards */}
              <div className="absolute -top-4 -left-4 sm:-left-16 glass rounded-xl p-4 animate-bounce" style={{ animationDuration: "3s" }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Instant Results</p>
                    <p className="text-xs text-muted-foreground">Copy & paste ready</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 sm:-right-16 glass rounded-xl p-4 animate-bounce" style={{ animationDuration: "4s", animationDelay: "0.5s" }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/20">
                    <Brain className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">AI Agents</p>
                    <p className="text-xs text-muted-foreground">Automate everything</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Row */}
        <div className="mt-16 flex flex-wrap justify-center gap-4">
          <Link href="/prompts">
            <Button size="lg" className="gradient-primary text-primary-foreground border-0">
              Explore Free Prompts
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/shop">
            <Button size="lg" variant="outline" className="border-border hover:bg-card">
              View Premium Packs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
