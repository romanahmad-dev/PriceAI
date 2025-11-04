import fetch from "node-fetch"
import * as cheerio from "cheerio"

export interface ScrapedProduct {
  title: string
  price: number
  url: string
  image?: string
  description?: string
  source: string
}

// Scrape Amazon products (example implementation)
export async function scrapeAmazon(query: string): Promise<ScrapedProduct[]> {
  try {
    // In production, use proper proxy/API service to avoid blocking
    const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`

    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!response.ok) return []

    const html = await response.text()
    const $ = cheerio.load(html)
    const products: ScrapedProduct[] = []

    $('[data-component-type="s-search-result"]').each((_, element) => {
      const $elem = $(element)
      const title = $elem.find("h2 a span").text().trim()
      const priceText = $elem.find(".a-price-whole").first().text().trim()
      const price = Number.parseFloat(priceText.replace(/[^0-9.]/g, ""))
      const url = $elem.find("h2 a").attr("href") || ""
      const image = $elem.find("img").attr("src") || ""

      if (title && price) {
        products.push({
          title,
          price,
          url: url.startsWith("http") ? url : `https://amazon.com${url}`,
          image,
          description: title,
          source: "Amazon",
        })
      }
    })

    return products.slice(0, 10) // Return top 10 products
  } catch (error) {
    console.error("Amazon scraping error:", error)
    return []
  }
}

// Scrape eBay products (example implementation)
export async function scrapeEbay(query: string): Promise<ScrapedProduct[]> {
  try {
    const searchUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`

    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!response.ok) return []

    const html = await response.text()
    const $ = cheerio.load(html)
    const products: ScrapedProduct[] = []

    $(".s-item").each((_, element) => {
      const $elem = $(element)
      const title = $elem.find(".s-item__title").text().trim()
      const priceText = $elem.find(".s-item__price").first().text().trim()
      const price = Number.parseFloat(priceText.replace(/[^0-9.]/g, ""))
      const url = $elem.find(".s-item__link").attr("href") || ""
      const image = $elem.find(".s-item__image img").attr("src") || ""

      if (title && price) {
        products.push({
          title,
          price,
          url,
          image,
          description: title,
          source: "eBay",
        })
      }
    })

    return products.slice(0, 10)
  } catch (error) {
    console.error("eBay scraping error:", error)
    return []
  }
}

// Generic scraper for multiple sources
export async function scrapeMultipleSources(query: string): Promise<ScrapedProduct[]> {
  try {
    const [amazonProducts, ebayProducts] = await Promise.all([scrapeAmazon(query), scrapeEbay(query)])

    // Combine and deduplicate results
    const allProducts = [...amazonProducts, ...ebayProducts]
    const seen = new Set<string>()
    const unique = allProducts.filter((product) => {
      const key = `${product.title.toLowerCase()}-${product.price}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    return unique.sort((a, b) => a.price - b.price).slice(0, 20)
  } catch (error) {
    console.error("Multi-source scraping error:", error)
    return []
  }
}
