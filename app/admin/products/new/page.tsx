"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-react"
import Link from "next/link"

const productTypes = [
  { value: "course", label: "Course" },
  { value: "prompt-pack", label: "Prompt Pack" },
  { value: "playbook", label: "Playbook" },
]

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [newFeature, setNewFeature] = useState("")
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    type: "course",
    features: [] as string[],
    is_featured: false,
    is_active: true,
  })

  const addFeature = () => {
    if (newFeature.trim()) {
      setProduct({ ...product, features: [...product.features, newFeature.trim()] })
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setProduct({
      ...product,
      features: product.features.filter((_, i) => i !== index),
    })
  }

  const handleSave = async () => {
    if (!product.name || !product.price) return
    
    setLoading(true)
    const supabase = createClient()
    
    const { error } = await supabase.from("products").insert({
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      type: product.type,
      features: product.features,
      is_featured: product.is_featured,
      is_active: product.is_active,
    })

    if (error) {
      console.error("Save error:", error)
      setLoading(false)
    } else {
      router.push("/admin/products")
      router.refresh()
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <p className="text-sm text-muted-foreground">
            Create a course, prompt pack, or playbook
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="glass rounded-2xl p-6 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="E.g., AI Content Mastery Course"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="97.00"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              className="bg-input border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Product Type</Label>
          <select
            id="type"
            value={product.type}
            onChange={(e) => setProduct({ ...product, type: e.target.value })}
            className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
          >
            {productTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="What does this product include?"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            className="bg-input border-border"
            rows={3}
          />
        </div>

        {/* Features */}
        <div className="space-y-2">
          <Label>Features</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add a feature..."
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              className="bg-input border-border"
            />
            <Button type="button" onClick={addFeature} variant="outline" className="border-border">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {product.features.length > 0 && (
            <ul className="space-y-2 mt-3">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                  <span className="text-sm">{feature}</span>
                  <button
                    onClick={() => removeFeature(index)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Toggles */}
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={product.is_featured}
              onChange={(e) => setProduct({ ...product, is_featured: e.target.checked })}
              className="accent-primary h-4 w-4"
            />
            <span className="text-sm">Featured Product</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={product.is_active}
              onChange={(e) => setProduct({ ...product, is_active: e.target.checked })}
              className="accent-primary h-4 w-4"
            />
            <span className="text-sm">Active (visible in shop)</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <Link href="/admin/products">
            <Button variant="outline" className="border-border hover:bg-card">
              Cancel
            </Button>
          </Link>
          <Button
            onClick={handleSave}
            disabled={loading || !product.name || !product.price}
            className="gradient-primary text-primary-foreground border-0"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Product
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
