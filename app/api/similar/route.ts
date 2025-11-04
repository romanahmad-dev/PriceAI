import { type NextRequest, NextResponse } from "next/server"
import { getVectorStore } from "@/lib/vector-store"

export async function POST(request: NextRequest) {
  try {
    const { query, topK = 5 } = (await request.json()) as { query: string; topK?: number }

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 })
    }

    const vectorStore = getVectorStore()
    const results = await vectorStore.search(query, topK)

    return NextResponse.json({
      query,
      results,
      count: results.length,
    })
  } catch (error) {
    console.error("Similarity search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
