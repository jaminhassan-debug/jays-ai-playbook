"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Star, Zap } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  type: string
  features: string[]
  is_featured: boolean
}

const productTypes = [
  { value: "all", label: "All Products" },
  { value: "course", label: "Courses" },
  { value: "prompt-pack", label: "Prompt Packs" },
  { value: "playbook", label: "Playbooks" },
]

// Sample products for when database is empty
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "AI Content Mastery Course",
    description: "The complete video course to master AI-powered content creation. From basics to advanced automation.",
    price: 197,
    type: "course",
    features: [
      "40+ video lessons",
      "Lifetime access",
      "Private community",
      "Monthly Q&A calls",
      "100+ bonus prompts",
      "Certificate of completion",
    ],
    is_featured: true,
  },
  {
    id: "2",
    name: "Ultimate Prompt Pack",
    description: "500+ battle-tested prompts for content, marketing, automation, and monetization.",
    price: 47,
    type: "prompt-pack",
    features: [
      "500+ prompts",
      "5 categories",
      "Regular updates",
      "Copy-paste ready",
      "Use case examples",
    ],
    is_featured: false,
  },
  {
    id: "3",
    name: "AI Business Playbook",
    description: "Step-by-step guide to building a profitable AI-powered business from scratch.",
    price: 97,
    type: "playbook",
    features: [
      "Complete blueprint",
      "Business templates",
      "Pricing strategies",
      "Client acquisition",
      "Scaling tactics",
    ],
    is_featured: false,
  },
  {
    id: "4",
    name: "Social Media AI Bundle",
    description: "Everything you need to dominate social media with AI-generated content.",
    price: 67,
    type: "prompt-pack",
    features: [
      "Platform-specific prompts",
      "Hook formulas",
      "Viral content templates",
      "Engagement strategies",
    ],
    is_featured: false,
  },
]

export function ProductsGrid({ products }: { products: Product[] }) {
  const items = products.length > 0 ? products : sampleProducts
  const [selectedType, setSelectedType] = useState("all")

  const filteredProducts = items.filter((product) =>
    selectedType === "all" || product.type === selectedType
  )

  return (
    <div>
      {/* Type Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {productTypes.map((type) => (
          <Button
            key={type.value}
            variant={selectedType === type.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type.value)}
            className={
              selectedType === type.value
                ? "gradient-primary text-primary-foreground border-0"
                : "border-border hover:bg-card"
            }
          >
            {type.label}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={`glass rounded-2xl p-6 relative ${
              product.is_featured ? "ring-2 ring-primary glow-primary" : ""
            }`}
          >
            {/* Featured Badge */}
            {product.is_featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-primary text-xs font-semibold flex items-center gap-1">
                <Star className="h-3 w-3" />
                Most Popular
              </div>
            )}

            {/* Product Type */}
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-secondary/20 text-secondary capitalize">
              {product.type.replace("-", " ")}
            </span>

            {/* Product Info */}
            <h3 className="text-xl font-semibold mt-4 mb-2">{product.name}</h3>
            {product.description && (
              <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
            )}

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold gradient-text">${product.price}</span>
              <span className="text-muted-foreground ml-2">one-time</span>
            </div>

            {/* Features */}
            <ul className="space-y-2 mb-6">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-accent shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button
              className={`w-full ${
                product.is_featured
                  ? "gradient-primary text-primary-foreground border-0"
                  : "border-border hover:bg-card"
              }`}
              variant={product.is_featured ? "default" : "outline"}
            >
              <Zap className="h-4 w-4 mr-2" />
              Get Access
            </Button>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found in this category.</p>
        </div>
      )}
    </div>
  )
}
