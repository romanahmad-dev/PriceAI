import { ExternalLink, TrendingDown, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
  savings?: number
  isBest?: boolean
}

export function ProductCard({ product, savings, isBest }: ProductCardProps) {
  return (
    <div
      className={`rounded-lg border overflow-hidden hover:shadow-lg transition ${
        isBest
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
      }`}
    >
      {isBest && (
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 text-sm font-semibold">
          Best Price
        </div>
      )}

      <div className="p-4">
        {product.image && (
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-40 object-cover rounded-md mb-3"
          />
        )}

        <h3 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">{product.title}</h3>

        {product.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
          {savings && savings > 0 && (
            <span className="text-sm font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
              <TrendingDown className="w-4 h-4" />
              Save ${savings.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-4 text-sm">
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full">
            {product.source}
          </span>
        </div>

        <Button
          asChild
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
        >
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            View Product
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}
