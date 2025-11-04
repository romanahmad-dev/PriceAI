import { type NextRequest, NextResponse } from "next/server"
import { scrapeMultipleSources } from "@/lib/scraper"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 })
    }

    // Scrape products from multiple sources
    const products = await scrapeMultipleSources(query)

    if (products.length === 0) {
      return NextResponse.json({ error: "No products found" }, { status: 404 })
    }

    // Return scraped products for now
    // Later these will be vectorized and processed by Gemini
    return NextResponse.json({
      query,
      products,
      count: products.length,
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
