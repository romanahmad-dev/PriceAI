import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { generateRecommendations } from "@/lib/gemini"
import type { Product } from "@/lib/types"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Mock product database (in production, this would be FAISS vector store)
const MOCK_PRODUCTS = [
  {
    title: "Samsung Galaxy A15",
    description: "6GB RAM, 128GB Storage, 5000mAh Battery, 50MP Camera",
    price: 299.99,
    source: "Amazon",
    url: "https://amazon.com/Samsung-Galaxy-A15",
  },
  {
    title: "Redmi Note 13",
    description: "6GB RAM, 128GB Storage, 5000mAh Battery, 50MP Camera",
    price: 249.99,
    source: "Amazon",
    url: "https://amazon.com/Redmi-Note-13",
  },
  {
    title: "Realme 11 Pro",
    description: "8GB RAM, 128GB Storage, 5000mAh Battery, 50MP Camera",
    price: 269.99,
    source: "Flipkart",
    url: "https://flipkart.com/Realme-11-Pro",
  },
  {
    title: "Samsung Galaxy A14",
    description: "4GB RAM, 64GB Storage, 5000mAh Battery, 48MP Camera",
    price: 229.99,
    source: "Amazon",
    url: "https://amazon.com/Samsung-Galaxy-A14",
  },
  {
    title: "Xiaomi Poco X5",
    description: "6GB RAM, 128GB Storage, 5000mAh Battery, 48MP Camera",
    price: 239.99,
    source: "Amazon",
    url: "https://amazon.com/Xiaomi-Poco-X5",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { product, alternatives } = (await request.json()) as {
      product: Product
      alternatives: Product[]
    }

    if (!product || !Array.isArray(alternatives)) {
      return NextResponse.json({ error: "Invalid product or alternatives" }, { status: 400 })
    }

    const recommendations = await generateRecommendations(
      {
        productTitle: product.title,
        productDescription: product.description,
        price: product.price,
        source: product.source,
      },
      alternatives.map((alt) => ({
        title: alt.title,
        price: alt.price,
        source: alt.source,
        description: alt.description,
      })),
    )

    return NextResponse.json({
      originalProduct: product,
      recommendations,
      count: recommendations.length,
    })
  } catch (error) {
    console.error("Recommendation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
