import { NextResponse } from "next/server"
import { getVectorStore } from "@/lib/vector-store"

export async function POST() {
  try {
    const vectorStore = getVectorStore()
    vectorStore.clear()

    return NextResponse.json({
      success: true,
      message: "Vector store cleared",
    })
  } catch (error) {
    console.error("Clear error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
