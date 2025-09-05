import { type NextRequest, NextResponse } from "next/server"

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

// Mock data fallback
const mockMoviesData = {
  results: [
    {
      id: 1,
      title: "The Future of Cinema",
      overview: "A groundbreaking film that explores the intersection of technology and storytelling.",
      poster_path: "/abstract-movie-poster.png",
      backdrop_path: "/movie-set-cinematography-behind-scenes.jpg",
      release_date: "2024-12-01",
      vote_average: 8.5,
      genre_ids: [28, 12, 878],
      popularity: 95.2,
    },
    {
      id: 2,
      title: "Digital Dreams",
      overview: "An epic adventure through virtual worlds and digital landscapes.",
      poster_path: "/abstract-movie-poster.png",
      backdrop_path: "/movie-set-cinematography-behind-scenes.jpg",
      release_date: "2024-11-15",
      vote_average: 7.8,
      genre_ids: [878, 12],
      popularity: 87.1,
    },
    {
      id: 3,
      title: "Tomorrow's Heroes",
      overview: "A thrilling story about ordinary people doing extraordinary things.",
      poster_path: "/abstract-movie-poster.png",
      backdrop_path: "/movie-set-cinematography-behind-scenes.jpg",
      release_date: "2024-10-20",
      vote_average: 8.2,
      genre_ids: [28, 18],
      popularity: 92.5,
    },
  ],
  total_results: 3,
  page: 1,
}

export async function GET(request: NextRequest) {
  try {
  console.log("[pgagi] Movies API route called")
  console.log("[pgagi] TMDB_API_KEY exists:", !!TMDB_API_KEY)

    if (!TMDB_API_KEY) {
  console.log("[pgagi] No TMDB_API_KEY found, using mock data")
      return NextResponse.json(mockMoviesData)
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "popular"
    const query = searchParams.get("query")
    const page = searchParams.get("page") || "1"

    let url: string

    if (query) {
      url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    } else {
      switch (type) {
        case "trending":
          url = `${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}&page=${page}`
          break
        case "top_rated":
          url = `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}`
          break
        case "upcoming":
          url = `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&page=${page}`
          break
        default:
          url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
      }
    }

  console.log("[pgagi] Fetching from TMDB API:", url.replace(TMDB_API_KEY, "***"))

    const response = await fetch(url)
  console.log("[pgagi] TMDB API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
  console.log("[pgagi] TMDB API error response:", errorText)

      // Return mock data on API failure
  console.log("[pgagi] Returning mock data due to API error")
      return NextResponse.json(mockMoviesData)
    }

    const data = await response.json()
  console.log("[pgagi] TMDB API success, results count:", data.results?.length || 0)
    return NextResponse.json(data)
  } catch (error) {
  console.error("[pgagi] Error in movies API route:", error)
    // Return mock data on any error
    return NextResponse.json(mockMoviesData)
  }
}
