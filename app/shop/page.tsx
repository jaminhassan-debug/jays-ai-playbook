import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { createClient } from "@/lib/supabase/server"
import { ProductsGrid } from "@/components/shop/products-grid"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop - AI Courses & Prompt Packs",
  description: "Premium AI courses, prompt packs, and playbooks to accelerate your success with artificial intelligence.",
}

export default async function ShopPage() {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="gradient-text">Premium AI Resources</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Level up your AI game with our premium courses, prompt packs, and comprehensive playbooks.
            </p>
          </div>

          <ProductsGrid products={products || []} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
