// Mock social media API since we don't have real social media API keys
export interface SocialPost {
  id: string
  username: string
  content: string
  image?: string
  likes: number
  comments: number
  timestamp: string
  hashtags: string[]
  verified?: boolean
}

const mockSocialPosts: SocialPost[] = [
  {
    id: "social_1",
    username: "techguru2024",
    content: "Just witnessed the most incredible AI demo at #TechConf2024! The future is here 🚀",
    image: "/tech-conference-ai-demo.jpg",
    likes: 1247,
    comments: 89,
    timestamp: "2024-01-15T10:30:00Z",
    hashtags: ["TechConf2024", "AI", "Innovation"],
    verified: true,
  },
  {
    id: "social_2",
    username: "spacefan_official",
    content: "Mars rover just sent back the most stunning images! Space exploration never ceases to amaze me ✨",
    image: "/mars-rover-space-exploration.jpg",
    likes: 2156,
    comments: 234,
    timestamp: "2024-01-15T08:15:00Z",
    hashtags: ["Mars", "SpaceExploration", "NASA"],
    verified: false,
  },
  {
    id: "social_3",
    username: "climate_action",
    content: "Renewable energy just hit a new milestone! Solar power is now cheaper than ever 🌱",
    image: "/solar-panels-renewable-energy.jpg",
    likes: 892,
    comments: 156,
    timestamp: "2024-01-15T06:45:00Z",
    hashtags: ["ClimateAction", "RenewableEnergy", "Solar"],
    verified: true,
  },
  {
    id: "social_4",
    username: "movie_insider",
    content: "Behind the scenes of the latest blockbuster! The cinematography is absolutely breathtaking 🎬",
    image: "/movie-set-cinematography-behind-scenes.jpg",
    likes: 1543,
    comments: 201,
    timestamp: "2024-01-15T14:20:00Z",
    hashtags: ["Movies", "BehindTheScenes", "Cinematography"],
    verified: true,
  },
]

export const fetchSocialPosts = async (hashtag?: string): Promise<SocialPost[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (hashtag) {
    return mockSocialPosts.filter((post) =>
      post.hashtags.some((tag) => tag.toLowerCase().includes(hashtag.toLowerCase())),
    )
  }

  return mockSocialPosts
}

export const searchSocialPosts = async (query: string): Promise<SocialPost[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600))

  return mockSocialPosts.filter(
    (post) =>
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.username.toLowerCase().includes(query.toLowerCase()) ||
      post.hashtags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
  )
}
