"use client"

import { motion } from "framer-motion"
import { Heart, ExternalLink, Play, Eye, Star, MessageCircle, Share2, Bookmark, TrendingUp } from "lucide-react"
import { useAppDispatch } from "@/lib/hooks"
import { toggleFavorite } from "@/lib/slices/content-slice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ContentItem } from "@/lib/slices/content-slice"

interface ContentCardProps {
  item: ContentItem
  index?: number
}

export function ContentCard({ item, index = 0 }: ContentCardProps) {
  const dispatch = useAppDispatch()

  const getActionIcon = () => {
    switch (item.type) {
      case "news":
        return <ExternalLink className="h-4 w-4" />
      case "movie":
        return <Play className="h-4 w-4" />
      case "social":
        return <Eye className="h-4 w-4" />
      default:
        return <ExternalLink className="h-4 w-4" />
    }
  }

  const getActionText = () => {
    switch (item.type) {
      case "news":
        return "Read Article"
      case "movie":
        return "Watch Trailer"
      case "social":
        return "View Post"
      default:
        return "View"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group"
    >
      <Card className="h-full overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
        <div className="relative overflow-hidden">
          <motion.img
            src={item.image || "/placeholder.svg?key=content"}
            alt={item.title}
            className="w-full h-48 object-cover transition-all duration-500 group-hover:scale-110"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {item.trending && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 left-2">
              <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-0 font-semibold shadow-sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            </motion.div>
          )}

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-200",
                item.isFavorite && "text-red-500 bg-red-50/80 hover:bg-red-100/80",
              )}
              onClick={(e) => {
                e.stopPropagation()
                dispatch(toggleFavorite(item.id))
              }}
            >
              <motion.div animate={{ scale: item.isFavorite ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.3 }}>
                <Heart className={cn("h-4 w-4", item.isFavorite && "fill-current")} />
              </motion.div>
            </Button>
          </motion.div>

          <Badge
            variant="secondary"
            className={cn(
              "absolute bottom-2 left-2 backdrop-blur-sm border-0 text-xs font-medium shadow-sm",
              item.type === "news" && "bg-blue-600 text-white",
              item.type === "movie" && "bg-purple-600 text-white",
              item.type === "social" && "bg-green-600 text-white",
            )}
          >
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Badge>

          {item.type === "movie" && item.rating && (
            <div className="absolute bottom-2 right-2 bg-black rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-white text-xs font-semibold">{item.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          <div className="space-y-2">
            <motion.h3
              className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
            >
              {item.title}
            </motion.h3>
            <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">{item.description}</p>
          </div>

          <div className="space-y-2">
            {item.source && (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">{item.source}</span>
                {item.publishedAt && <span>{new Date(item.publishedAt).toLocaleDateString()}</span>}
              </div>
            )}

            {item.type === "social" && (item.likes || item.comments) && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {item.likes && (
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{item.likes.toLocaleString()}</span>
                  </div>
                )}
                {item.comments && (
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{item.comments.toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}

            {item.hashtags && item.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.hashtags.slice(0, 3).map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs px-2 py-0">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 space-y-2">
          <div className="flex gap-2 w-full">
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground border-0"
              variant="default"
              onClick={() => {
                if (item.url) {
                  window.open(item.url, "_blank")
                }
              }}
            >
              {getActionIcon()}
              <span className="ml-2">{getActionText()}</span>
            </Button>

            <Button variant="ghost" size="icon" className="shrink-0">
              <Share2 className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" className="shrink-0">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
