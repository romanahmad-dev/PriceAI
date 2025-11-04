export interface Product {
  title: string
  price: number
  url: string
  image?: string
  description?: string
  source: string
  embedding?: number[] // For vector search
}

export interface SearchResult {
  query: string
  products: Product[]
  recommendations?: Product[]
}
