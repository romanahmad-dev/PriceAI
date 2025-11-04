import { type NextRequest, NextResponse } from "next/server"
import { getVectorStore } from "@/lib/vector-store"
import type { Product } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const { products } = (await request.json()) as { products: Product[] }

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "Invalid products array" }, { status: 400 })
    }

    const vectorStore = getVectorStore()

    for (const product of products) {
      const productText = `${product.title} ${product.description || ""} ${product.price}`
      await vectorStore.addVector(`${product.source}-${product.title}`, productText)
    }

    return NextResponse.json({
      success: true,
      vectorized: products.length,
      totalVectors: vectorStore.size(),
    })
  } catch (error) {
    console.error("Vectorization error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
