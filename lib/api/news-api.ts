const NEWS_API_BASE = "/api/news"

export interface NewsArticle {
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  source: {
    name: string
  }
  category?: string
}

export interface NewsResponse {
  articles: NewsArticle[]
  totalResults: number
}

export const fetchNews = async (category?: string, query?: string, page = 1): Promise<NewsResponse> => {
  try {
    let url = `${NEWS_API_BASE}?page=${page}`

    if (category && category !== "all") {
      url += `&category=${category}`
    }

    if (query) {
      url += `&query=${encodeURIComponent(query)}`
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching news:", error)
    throw error
  }
}

export const searchNews = async (query: string): Promise<NewsResponse> => {
  return fetchNews(undefined, query)
}
