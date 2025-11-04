import { NextResponse } from "next/server"
import { getVectorStore } from "@/lib/vector-store"

export async function GET() {
  try {
    const vectorStore = getVectorStore()
    const vectors = vectorStore.getAll()

    return NextResponse.json({
      count: vectors.length,
      vectors: vectors.slice(0, 100), // Limit response size
    })
  } catch (error) {
    console.error("Index error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
