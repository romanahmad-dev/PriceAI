import { type NextRequest, NextResponse } from "next/server"
import { generateProductInsights } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const { title, price } = (await request.json()) as { title: string; price: number }

    if (!title || typeof price !== "number") {
      return NextResponse.json({ error: "Invalid title or price" }, { status: 400 })
    }

    const insights = await generateProductInsights(title, price)

    return NextResponse.json({
      title,
      price,
      insights,
    })
  } catch (error) {
    console.error("Insights API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
