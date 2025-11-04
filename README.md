# PriceAI - AI-Powered Price Comparison

An intelligent price comparison platform that uses web scraping, vector search, and generative AI to find you the best deals across multiple e-commerce sites.

## Features

- **AI-Powered Search**: Natural language product search across multiple retailers
- **Smart Recommendations**: Gemini AI generates personalized shopping recommendations
- **Vector Search**: FAISS-based semantic similarity for finding truly comparable products
- **Multi-Source Comparison**: Scrapes and compares prices from Amazon, eBay, and more
- **Instant Savings**: Shows estimated savings and quality ratings for alternatives

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **AI**: Google Gemini API for recommendations and embeddings
- **Vector Search**: FAISS for semantic product matching
- **Web Scraping**: Cheerio for HTML parsing (with planned integration of ScrapingBee/ZenRows for production)
- **Deployment**: Vercel

## Getting Started

### 1. Clone and Install

\`\`\`bash
git clone <repository>
cd priceai
npm install
\`\`\`

### 2. Set Environment Variables

Create a `.env.local` file with your API keys:

\`\`\`env
GEMINI_API_KEY=your_gemini_api_key
\`\`\`

Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 3. Run Locally

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the app.

## Project Structure

\`\`\`
app/
├── api/
│   ├── search/         # Product search endpoint
│   ├── vectorize/      # Vector store management
│   ├── similar/        # Semantic search
│   ├── recommend/      # AI recommendations
│   └── insights/       # AI-generated insights
├── results/            # Results page
└── page.tsx            # Home page

components/
├── product-card.tsx    # Product display component
└── recommendation-card.tsx

lib/
├── scraper.ts          # Web scraping utilities
├── vector-store.ts     # FAISS vector database
├── gemini.ts          # Gemini API integration
└── types.ts           # TypeScript types
\`\`\`

## API Endpoints

- `POST /api/search` - Search for products
- `POST /api/vectorize` - Add products to vector store
- `POST /api/similar` - Semantic search
- `POST /api/recommend` - Generate AI recommendations
- `POST /api/insights` - Get AI insights about products
- `GET /api/products/index` - View indexed vectors
- `POST /api/products/clear` - Clear vector store

## Deployment

### Deploy to Vercel

\`\`\`bash
npm run build
vercel deploy
\`\`\`

### Configure Environment Variables on Vercel

1. Go to your Vercel project settings
2. Add `GEMINI_API_KEY` environment variable
3. Redeploy

### Production Recommendations

For production, consider:

1. **Use a proxy service for scraping**:
   - [ScrapingBee](https://www.scrapingbee.com/)
   - [ZenRows](https://www.zenrows.com/)
   - Handles anti-bot measures and rate limiting

2. **Use persistent vector storage**:
   - Supabase for vector storage
   - Pinecone for managed vector DB
   - Self-hosted Qdrant

3. **Add caching**:
   - Use Redis for caching search results
   - Implement ISR (Incremental Static Regeneration)

4. **Monitor and rate limit**:
   - Add request rate limiting
   - Monitor API usage and costs

## License

MIT

## Support

For issues or questions, open an issue on GitHub.
