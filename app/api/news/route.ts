import { type NextRequest, NextResponse } from "next/server"

const NEWS_API_KEY = process.env.NEWS_API_KEY
const NEWS_BASE_URL = "https://newsapi.org/v2"

// Mock data fallback
const mockNewsData = {
  articles: [
    {
      title: "AI Revolution Continues: New Breakthrough in Machine Learning",
      description: "Scientists have developed a new AI model that can understand context better than ever before.",
      url: "https://example.com/ai-breakthrough",
      urlToImage: "/tech-conference-ai-demo.jpg",
      publishedAt: new Date().toISOString(),
      source: { name: "Tech News" },
      category: "technology",
    },
    {
      title: "Space Exploration Reaches New Heights",
      description: "NASA's latest mission to Mars reveals fascinating discoveries about the red planet.",
      url: "https://example.com/mars-mission",
      urlToImage: "/mars-rover-space-exploration.jpg",
      publishedAt: new Date().toISOString(),
      source: { name: "Space Daily" },
      category: "science",
    },
    {
      title: "Renewable Energy Adoption Accelerates Globally",
      description: "Solar and wind power installations reach record highs as countries commit to clean energy.",
      url: "https://example.com/renewable-energy",
      urlToImage: "/solar-panels-renewable-energy.jpg",
      publishedAt: new Date().toISOString(),
      source: { name: "Green Tech" },
      category: "business",
    },
  ],
  totalResults: 3,
}

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] News API route called")
    console.log("[v0] NEWS_API_KEY exists:", !!NEWS_API_KEY)

    if (!NEWS_API_KEY) {
      console.log("[v0] No NEWS_API_KEY found, using mock data")
      return NextResponse.json(mockNewsData)
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const query = searchParams.get("query")
    const page = searchParams.get("page") || "1"

    let url = `${NEWS_BASE_URL}/top-headlines?country=us&apiKey=${NEWS_API_KEY}&pageSize=20&page=${page}`

    if (category && category !== "all") {
      url += `&category=${category}`
    }

    if (query) {
      url = `${NEWS_BASE_URL}/everything?q=${encodeURIComponent(query)}&apiKey=${NEWS_API_KEY}&pageSize=20&sortBy=publishedAt&page=${page}`
    }

    console.log("[v0] Fetching from News API:", url.replace(NEWS_API_KEY, "***"))

    const response = await fetch(url, {
      headers: {
        "User-Agent": "MyDashboard/1.0",
      },
    })

    console.log("[v0] News API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] News API error response:", errorText)

      // Return mock data on API failure
      console.log("[v0] Returning mock data due to API error")
      return NextResponse.json(mockNewsData)
    }

    const data = await response.json()
    console.log("[v0] News API success, articles count:", data.articles?.length || 0)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error in news API route:", error)
    // Return mock data on any error
    return NextResponse.json(mockNewsData)
  }
}
