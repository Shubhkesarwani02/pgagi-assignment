import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { fetchNews, searchNews, type NewsArticle } from "@/lib/api/news-api"
import { fetchTrendingMovies, fetchPopularMovies, searchMovies, getImageUrl, type Movie } from "@/lib/api/tmdb-api"
import { fetchSocialPosts, searchSocialPosts, type SocialPost } from "@/lib/api/social-api"

export interface ContentItem {
  id: string
  type: "news" | "movie" | "social"
  title: string
  description: string
  image: string
  category: string
  trending?: boolean
  isFavorite?: boolean
  source?: string
  publishedAt?: string
  url?: string
  rating?: number
  likes?: number
  comments?: number
  username?: string
  hashtags?: string[]
}

interface ContentState {
  items: ContentItem[]
  trending: ContentItem[]
  favorites: ContentItem[]
  loading: boolean
  searchResults: ContentItem[]
  searchQuery: string
  categories: string[]
  selectedCategory: string
  error: string | null
  hasMore: boolean
  page: number
}

const initialState: ContentState = {
  items: [],
  trending: [],
  favorites: [],
  loading: false,
  searchResults: [],
  searchQuery: "",
  categories: ["all", "technology", "entertainment", "business", "health", "science", "sports"],
  selectedCategory: "all",
  error: null,
  hasMore: true,
  page: 1,
}

const transformNewsToContentItem = (article: NewsArticle): ContentItem => ({
  id: `news_${Date.now()}_${Math.random()}`,
  type: "news",
  title: article.title,
  description: article.description || "No description available",
  image: article.urlToImage || "/news-article.png",
  category: article.category || "general",
  source: article.source.name,
  publishedAt: article.publishedAt,
  url: article.url,
})

const transformMovieToContentItem = (movie: Movie, trending = false): ContentItem => ({
  id: `movie_${movie.id}`,
  type: "movie",
  title: movie.title,
  description: movie.overview,
  image: getImageUrl(movie.poster_path),
  category: "entertainment",
  trending,
  rating: movie.vote_average,
  publishedAt: movie.release_date,
})

const transformSocialToContentItem = (post: SocialPost): ContentItem => ({
  id: post.id,
  type: "social",
  title: `@${post.username}`,
  description: post.content,
  image: post.image || "/social-media-post.png",
  category: "social",
  username: post.username,
  likes: post.likes,
  comments: post.comments,
  publishedAt: post.timestamp,
  hashtags: post.hashtags,
})

export const fetchContent = createAsyncThunk(
  "content/fetchContent",
  async (params: { category?: string; refresh?: boolean } = {}) => {
    try {
      const { category = "all" } = params
  console.log("[pgagi] Fetching content for category:", category)

      const results = await Promise.allSettled([
        fetchNews(category === "all" ? undefined : category),
        fetchPopularMovies(),
        fetchSocialPosts(),
      ])

      let newsItems: ContentItem[] = []
      let movieItems: ContentItem[] = []
      let socialItems: ContentItem[] = []

      // Handle news API result
      if (results[0].status === "fulfilled") {
        newsItems = results[0].value.articles.slice(0, 8).map(transformNewsToContentItem)
  console.log("[pgagi] Successfully fetched", newsItems.length, "news items")
      } else {
  console.error("[pgagi] News API failed:", results[0].reason)
      }

      // Handle movies API result
      if (results[1].status === "fulfilled") {
        movieItems = results[1].value.results.slice(0, 6).map((movie) => transformMovieToContentItem(movie))
  console.log("[pgagi] Successfully fetched", movieItems.length, "movie items")
      } else {
  console.error("[pgagi] Movies API failed:", results[1].reason)
      }

      // Handle social API result
      if (results[2].status === "fulfilled") {
        socialItems = results[2].value.slice(0, 4).map(transformSocialToContentItem)
  console.log("[pgagi] Successfully fetched", socialItems.length, "social items")
      } else {
  console.error("[pgagi] Social API failed:", results[2].reason)
      }

      const allItems = [...newsItems, ...movieItems, ...socialItems]
  console.log("[pgagi] Total content items:", allItems.length)
      return allItems
    } catch (error) {
  console.error("[pgagi] Error fetching content:", error)
      throw error
    }
  },
)

export const fetchTrendingContent = createAsyncThunk("content/fetchTrendingContent", async () => {
  try {
  console.log("[pgagi] Fetching trending content")

    const results = await Promise.allSettled([fetchTrendingMovies(), fetchNews("technology")])

    let movieItems: ContentItem[] = []
    let newsItems: ContentItem[] = []

    if (results[0].status === "fulfilled") {
      movieItems = results[0].value.results.slice(0, 8).map((movie) => transformMovieToContentItem(movie, true))
  console.log("[pgagi] Successfully fetched", movieItems.length, "trending movies")
    } else {
  console.error("[pgagi] Trending movies API failed:", results[0].reason)
    }

    if (results[1].status === "fulfilled") {
      newsItems = results[1].value.articles.slice(0, 4).map((article) => ({
        ...transformNewsToContentItem(article),
        trending: true,
      }))
  console.log("[pgagi] Successfully fetched", newsItems.length, "trending news")
    } else {
  console.error("[pgagi] Trending news API failed:", results[1].reason)
    }

    const allTrending = [...movieItems, ...newsItems]
  console.log("[pgagi] Total trending items:", allTrending.length)
    return allTrending
  } catch (error) {
  console.error("[pgagi] Error fetching trending content:", error)
    throw error
  }
})

export const searchContent = createAsyncThunk("content/searchContent", async (query: string) => {
  if (!query.trim()) return []

  try {
  console.log("[pgagi] Searching content for query:", query)

    const results = await Promise.allSettled([searchNews(query), searchMovies(query), searchSocialPosts(query)])

    let newsItems: ContentItem[] = []
    let movieItems: ContentItem[] = []
    let socialItems: ContentItem[] = []

    if (results[0].status === "fulfilled") {
      newsItems = results[0].value.articles.slice(0, 6).map(transformNewsToContentItem)
  console.log("[pgagi] Found", newsItems.length, "news results")
    } else {
  console.error("[pgagi] News search failed:", results[0].reason)
    }

    if (results[1].status === "fulfilled") {
      movieItems = results[1].value.results.slice(0, 6).map((movie) => transformMovieToContentItem(movie))
  console.log("[pgagi] Found", movieItems.length, "movie results")
    } else {
  console.error("[pgagi] Movie search failed:", results[1].reason)
    }

    if (results[2].status === "fulfilled") {
      socialItems = results[2].value.slice(0, 4).map(transformSocialToContentItem)
  console.log("[pgagi] Found", socialItems.length, "social results")
    } else {
  console.error("[pgagi] Social search failed:", results[2].reason)
    }

    const allResults = [...newsItems, ...movieItems, ...socialItems]
  console.log("[pgagi] Total search results:", allResults.length)
    return allResults
  } catch (error) {
  console.error("[pgagi] Error searching content:", error)
    throw error
  }
})

export const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.id === action.payload)
      if (item) {
        item.isFavorite = !item.isFavorite
        if (item.isFavorite) {
          // Add to favorites if not already there
          if (!state.favorites.find((fav) => fav.id === item.id)) {
            state.favorites.push({ ...item })
          }
        } else {
          state.favorites = state.favorites.filter((fav) => fav.id !== action.payload)
        }
      }

      // Also update in search results
      const searchItem = state.searchResults.find((item) => item.id === action.payload)
      if (searchItem) {
        searchItem.isFavorite = !searchItem.isFavorite
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    clearSearchResults: (state) => {
      state.searchResults = []
      state.searchQuery = ""
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload
    },
    reorderContent: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload
      const [removed] = state.items.splice(fromIndex, 1)
      state.items.splice(toIndex, 0, removed)
    },
    reorderFavorites: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload
      const [removed] = state.favorites.splice(fromIndex, 1)
      state.favorites.splice(toIndex, 0, removed)
    },
    loadMoreContent: (state) => {
      state.page += 1
    },
    resetPagination: (state) => {
      state.page = 1
      state.hasMore = true
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch content cases
      .addCase(fetchContent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.error = null
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch content"
      })
      // Fetch trending cases
      .addCase(fetchTrendingContent.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchTrendingContent.fulfilled, (state, action) => {
        state.loading = false
        state.trending = action.payload
      })
      .addCase(fetchTrendingContent.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch trending content"
      })
      // Search content cases
      .addCase(searchContent.pending, (state) => {
        state.loading = true
      })
      .addCase(searchContent.fulfilled, (state, action) => {
        state.loading = false
        state.searchResults = action.payload
      })
      .addCase(searchContent.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Search failed"
      })
  },
})

export const { 
  toggleFavorite, 
  setSearchQuery, 
  clearSearchResults, 
  setSelectedCategory, 
  reorderContent, 
  reorderFavorites,
  loadMoreContent,
  resetPagination,
  clearError 
} = contentSlice.actions
