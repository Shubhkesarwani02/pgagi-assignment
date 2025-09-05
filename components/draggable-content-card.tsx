"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, ExternalLink, Calendar, Star, User, MessageCircle, Eye } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppDispatch } from "@/lib/hooks"
import { toggleFavorite, type ContentItem } from "@/lib/slices/content-slice"
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'

interface DraggableContentCardProps {
  item: ContentItem
  layout?: "grid" | "list"
  isDragEnabled?: boolean
}

export function DraggableContentCard({ item, layout = "grid", isDragEnabled = true }: DraggableContentCardProps) {
  const dispatch = useAppDispatch()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: item.id,
    disabled: !isDragEnabled,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleFavoriteClick = () => {
    dispatch(toggleFavorite(item.id))
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true)
  }

  const getImageSrc = () => {
    if (imageError) {
      switch (item.type) {
        case "news": return "/news-article.png"
        case "movie": return "/abstract-movie-poster.png"
        case "social": return "/social-media-post.png"
        default: return "/placeholder.jpg"
      }
    }
    return item.image
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString()
  }

  const isListLayout = layout === "list"

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isDragEnabled ? listeners : {})}
      className={`cursor-${isDragEnabled ? 'grab' : 'pointer'} active:cursor-${isDragEnabled ? 'grabbing' : 'pointer'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`overflow-hidden h-full transition-all duration-200 hover:shadow-lg border-muted/50 backdrop-blur-sm ${
        isListLayout ? 'flex flex-row' : 'flex flex-col'
      } ${isDragging ? 'shadow-2xl ring-2 ring-primary/20' : ''}`}>
        <div className={`relative ${isListLayout ? 'w-48 flex-shrink-0' : 'w-full h-48'}`}>
          <AnimatePresence>
            {!imageLoaded && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-muted animate-pulse rounded-t-lg flex items-center justify-center"
              >
                <Eye className="w-8 h-8 text-muted-foreground/30" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <img
            src={getImageSrc()}
            alt={item.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${isListLayout ? 'rounded-l-lg' : 'rounded-t-lg'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          
          <div className="absolute top-2 left-2 flex gap-1">
            <Badge variant="secondary" className="text-xs">
              {item.type}
            </Badge>
            {item.trending && (
              <Badge variant="destructive" className="text-xs">
                Trending
              </Badge>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 h-8 w-8 rounded-full backdrop-blur-sm transition-colors ${
              item.isFavorite 
                ? 'bg-red-500/80 hover:bg-red-600/80 text-white' 
                : 'bg-black/20 hover:bg-black/40 text-white'
            }`}
            onClick={handleFavoriteClick}
          >
            <Heart className={`h-4 w-4 ${item.isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <div className="flex flex-col flex-1">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold line-clamp-2 text-sm leading-tight">
                {item.title}
              </h3>
              {item.rating && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{item.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            {item.username && (
              <div className="flex items-center gap-2 mt-1">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/diverse-user-avatars.png" />
                  <AvatarFallback>
                    <User className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">@{item.username}</span>
              </div>
            )}
          </CardHeader>

          <CardContent className="pb-2 flex-1">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {item.description}
            </p>
            
            {item.hashtags && item.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.hashtags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {item.publishedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(item.publishedAt)}</span>
                </div>
              )}
              
              {item.source && (
                <span className="font-medium">{item.source}</span>
              )}
              
              {item.likes && (
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>{item.likes}</span>
                </div>
              )}
              
              {item.comments && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{item.comments}</span>
                </div>
              )}
            </div>
            
            {item.url && (
              <Button variant="ghost" size="sm" asChild>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  <span className="text-xs">View</span>
                </a>
              </Button>
            )}
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  )
}
