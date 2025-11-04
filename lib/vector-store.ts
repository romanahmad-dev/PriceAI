// Using node-fetch and a lightweight vector similarity library
interface Vector {
  id: string
  text: string
  embedding: number[]
}

export class VectorStore {
  private vectors: Vector[] = []
  private embeddings: Map<string, number[]> = new Map()

  // Simple cosine similarity implementation
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }

    normA = Math.sqrt(normA)
    normB = Math.sqrt(normB)

    if (normA === 0 || normB === 0) return 0
    return dotProduct / (normA * normB)
  }

  // Generate a mock embedding (in production, use actual embeddings from Gemini)
  private async generateMockEmbedding(text: string): Promise<number[]> {
    // Simple hash-based embedding for demo purposes
    const hash = text.split("").reduce((acc, char) => {
      return (acc << 5) - acc + char.charCodeAt(0)
    }, 0)

    const embedding: number[] = []
    let seed = hash
    for (let i = 0; i < 128; i++) {
      seed = (seed * 9301 + 49297) % 233280
      embedding.push((seed / 233280) * 2 - 1)
    }
    return embedding
  }

  // Add a vector to the store
  async addVector(id: string, text: string, embedding?: number[]): Promise<void> {
    let emb = embedding

    if (!emb) {
      emb = await this.generateMockEmbedding(text)
    }

    this.vectors.push({ id, text, embedding: emb })
    this.embeddings.set(id, emb)
  }

  // Search for similar vectors
  async search(queryText: string, topK = 5): Promise<Vector[]> {
    const queryEmbedding = await this.generateMockEmbedding(queryText)

    const scored = this.vectors.map((vector) => ({
      ...vector,
      score: this.cosineSimilarity(queryEmbedding, vector.embedding),
    }))

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(({ score, ...vector }) => vector)
  }

  // Get all vectors
  getAll(): Vector[] {
    return this.vectors
  }

  // Clear the store
  clear(): void {
    this.vectors = []
    this.embeddings.clear()
  }

  // Get vector count
  size(): number {
    return this.vectors.length
  }
}

// Singleton instance
let instance: VectorStore | null = null

export function getVectorStore(): VectorStore {
  if (!instance) {
    instance = new VectorStore()
  }
  return instance
}
