import { 
  Sparkles, 
  Zap, 
  Brain, 
  Target, 
  Rocket,
  DollarSign 
} from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "Content Creation",
    description: "Generate viral social media posts, blog articles, and marketing copy that converts.",
    color: "text-primary",
    bgColor: "bg-primary/20",
  },
  {
    icon: Zap,
    title: "Marketing Automation",
    description: "Build AI-powered funnels and email sequences that work on autopilot.",
    color: "text-secondary",
    bgColor: "bg-secondary/20",
  },
  {
    icon: Brain,
    title: "AI Agents",
    description: "Deploy intelligent agents that handle research, writing, and customer support.",
    color: "text-accent",
    bgColor: "bg-accent/20",
  },
  {
    icon: Target,
    title: "Strategic Playbooks",
    description: "Step-by-step guides for building AI-powered businesses from scratch.",
    color: "text-primary",
    bgColor: "bg-primary/20",
  },
  {
    icon: Rocket,
    title: "Productivity Hacks",
    description: "10x your output with prompts designed for speed and efficiency.",
    color: "text-secondary",
    bgColor: "bg-secondary/20",
  },
  {
    icon: DollarSign,
    title: "Monetization Strategies",
    description: "Turn your AI skills into income streams with proven business models.",
    color: "text-accent",
    bgColor: "bg-accent/20",
  },
]

export function Features() {
  return (
    <section className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Everything You Need</span>
            <br />
            <span className="text-foreground">to Master AI</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From beginner-friendly prompts to advanced automation playbooks, we&apos;ve got you covered.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass rounded-2xl p-6 hover:glow-primary transition-all duration-300 group"
            >
              <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:gradient-text transition-all">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
