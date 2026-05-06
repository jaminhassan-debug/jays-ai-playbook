import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus, Package, Edit, Star } from "lucide-react"
import Link from "next/link"

export default async function ProductsAdminPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage courses, prompt packs, and playbooks.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gradient-primary text-primary-foreground border-0">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Products Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {products && products.length > 0 ? (
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">Product</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Price</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{product.name}</p>
                          {product.is_featured && (
                            <Star className="h-4 w-4 text-accent fill-accent" />
                          )}
                        </div>
                        {product.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary/20 text-secondary capitalize">
                      {product.type?.replace("-", " ")}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold">${product.price}</span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      product.is_active 
                        ? "bg-accent/20 text-accent" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end">
                      <Link href={`/admin/products/${product.id}`}>
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
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No products yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first product to start selling.
            </p>
            <Link href="/admin/products/new">
              <Button className="gradient-primary text-primary-foreground border-0">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
