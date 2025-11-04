import { generateText } from "ai"

export interface RecommendationRequest {
  productTitle: string
  productDescription?: string
  price: number
  source: string
}

export interface Recommendation {
  title: string
  reason: string
  estimatedSavings: number
  qualityRating: number
}

export async function generateRecommendations(
  originalProduct: RecommendationRequest,
  similarProducts: Array<{
    title: string
    price: number
    source: string
    description?: string
  }>,
): Promise<Recommendation[]> {
  try {
    const productsList = similarProducts.map((p) => `- ${p.title} (${p.source}): $${p.price}`).join("\n")

    const prompt = `You are a smart shopping assistant. Analyze the following original product and similar alternatives, and provide recommendations for better value options.

Original Product:
- Title: ${originalProduct.productTitle}
- Price: $${originalProduct.price}
- Source: ${originalProduct.source}
${originalProduct.productDescription ? `- Description: ${originalProduct.productDescription}` : ""}

Similar Products Found:
${productsList}

For each alternative that's cheaper or offers better value, provide a JSON response with this exact structure (return valid JSON only, no markdown):
[
  {
    "title": "product name",
    "reason": "brief explanation why this is better",
    "estimatedSavings": number (savings in dollars),
    "qualityRating": number (1-5, where 5 is best)
  }
]

Only include products that are actually cheaper or offer significantly better value. Focus on the top 3 recommendations.`

    const { text } = await generateText({
      model: "google/gemini-1.5-flash",
      prompt,
    })

    // Parse the JSON response
    try {
      const parsed = JSON.parse(text)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      console.warn("Failed to parse Gemini response as JSON:", text)
      return []
    }
  } catch (error) {
    console.error("Gemini recommendation error:", error)
    return []
  }
}

export async function generateProductInsights(productTitle: string, price: number): Promise<string> {
  try {
    const prompt = `Provide a brief, helpful shopping insight about this product (max 2 sentences):
Product: ${productTitle}
Price: $${price}

Focus on value proposition and what to look for when buying this type of product.`

    const { text } = await generateText({
      model: "google/gemini-1.5-flash",
      prompt,
    })

    return text
  } catch (error) {
    console.error("Gemini insight error:", error)
    return "No additional insights available."
  }
}

export async function getEmbedding(text: string): Promise<number[]> {
  try {
    // Note: In a real implementation, you'd use Gemini's embeddings API
    // For now, we'll use a simple approach with the generateText API
    // Generate a deterministic embedding based on text
    const prompt = `Generate 5 important keywords for this product description: "${text.substring(0, 100)}"
Return only comma-separated keywords.`

    const { text: keywords } = await generateText({
      model: "google/gemini-1.5-flash",
      prompt,
    })

    // Create a mock embedding from keywords
    const embedding: number[] = []
    const keywordArray = keywords.split(",").map((k) => k.trim())

    for (let i = 0; i < 128; i++) {
      let sum = 0
      for (const keyword of keywordArray) {
        sum += keyword.charCodeAt(i % keyword.length)
      }
      embedding.push(((sum % 1000) / 1000) * 2 - 1)
    }

    return embedding
  } catch (error) {
    console.error("Gemini embedding error:", error)
    return new Array(128).fill(0)
  }
}
