"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, ArrowLeft } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { RecommendationCard } from "@/components/recommendation-card"
import type { Product } from "@/lib/types"

interface Recommendation {
  title: string
  reason: string
  estimatedSavings: number
  qualityRating: number
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("product") || ""

  const [products, setProducts] = useState<Product[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!query) return

    async function fetchResults() {
      try {
        setLoading(true)
        setError("")

        const searchRes = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        })

        if (!searchRes.ok) throw new Error("Search failed")
        const searchData = await searchRes.json()
        const fetchedProducts = searchData.products || []
        setProducts(fetchedProducts)

        if (fetchedProducts.length > 1) {
          const recRes = await fetch("/api/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              product: fetchedProducts[0],
              alternatives: fetchedProducts.slice(1),
            }),
          })

          if (recRes.ok) {
            const recData = await recRes.json()
            setRecommendations(recData.recommendations || [])
          }
        }
      } catch (err) {
        console.error("Error fetching results:", err)
        setError("Failed to fetch results. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit text-slate-300 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
            Back to Search
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Search Results</h1>
          <p className="text-xl text-slate-300">{query && `Results for: ${query}`}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mr-2" />
            <span className="text-slate-300">Finding best prices...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-500 rounded-lg p-6 text-center">
            <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
          </div>
        ) : (
          <>
            {/* Recommendations Section */}
            {recommendations.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">AI-Powered Recommendations</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.map((rec, idx) => (
                    <RecommendationCard key={idx} {...rec} />
                  ))}
                </div>
              </div>
            )}

            {/* Products Section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Available Options ({products.length})</h2>
              {products.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, idx) => (
                    <ProductCard
                      key={idx}
                      product={product}
                      isBest={idx === 0}
                      savings={products[0]?.price - product.price}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-400 text-lg">No products found</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
