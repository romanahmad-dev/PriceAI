"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Loader2, Search, TrendingDown, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Home() {
  const [productInput, setProductInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productInput.trim()) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: productInput }),
      })

      if (!response.ok) throw new Error("Search failed")

      const data = await response.json()
      // Navigate to results page with data
      window.location.href = `/results?product=${encodeURIComponent(productInput)}`
    } catch (err) {
      setError("Failed to search. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">PriceAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#about" className="text-slate-300 hover:text-white transition">
              About
            </Link>
            <Link href="#how-it-works" className="text-slate-300 hover:text-white transition">
              How it Works
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 text-balance">
            Find Better Prices with AI-Powered Recommendations
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto text-balance">
            Paste a product link or name, and our AI finds you the best alternatives at lower prices across the web.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
          <div className="relative flex gap-2">
            <Input
              type="text"
              placeholder="Enter product URL or name (e.g., 'Samsung Galaxy A15')"
              value={productInput}
              onChange={(e) => setProductInput(e.target.value)}
              className="flex-1 px-6 py-4 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 text-lg"
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={loading}
              className="px-8 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Compare Prices
                </>
              )}
            </Button>
          </div>
          {error && <p className="text-red-400 mt-3 text-center">{error}</p>}
        </form>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition">
            <TrendingDown className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Find Lower Prices</h3>
            <p className="text-slate-400">
              Our AI finds similar or better products at lower prices across multiple sellers.
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500 transition">
            <Zap className="w-12 h-12 text-cyan-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Instant Results</h3>
            <p className="text-slate-400">Get recommendations in seconds powered by advanced AI and vector search.</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition">
            <Search className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Smart Matching</h3>
            <p className="text-slate-400">
              We understand product specifications and recommend truly comparable alternatives.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-950/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-400">
          <p>© 2025 PriceAI. AI-powered price comparison for smarter shopping.</p>
        </div>
      </footer>
    </div>
  )
}
