const MOVIES_API_BASE = "/api/movies"
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
  vote_average: number
  genre_ids: number[]
  popularity: number
}

export interface TMDBResponse {
  results: Movie[]
  total_results: number
  page: number
}

export const fetchTrendingMovies = async (): Promise<TMDBResponse> => {
  try {
    const response = await fetch(`${MOVIES_API_BASE}?type=trending`)
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching trending movies:", error)
    throw error
  }
}

export const fetchPopularMovies = async (): Promise<TMDBResponse> => {
  try {
    const response = await fetch(`${MOVIES_API_BASE}?type=popular`)
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching popular movies:", error)
    throw error
  }
}

export const searchMovies = async (query: string): Promise<TMDBResponse> => {
  try {
    const response = await fetch(`${MOVIES_API_BASE}?query=${encodeURIComponent(query)}`)
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error searching movies:", error)
    throw error
  }
}

export const getImageUrl = (path: string | null): string => {
  if (!path) return "/abstract-movie-poster.png"
  return `${TMDB_IMAGE_BASE}${path}`
}
