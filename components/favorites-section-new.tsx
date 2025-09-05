"use client"

import { motion } from "framer-motion"
import { useAppSelector } from "@/lib/hooks"
import { DragAndDropContentGrid } from "./drag-drop-content-grid"
import { Heart } from "lucide-react"

export function FavoritesSection() {
  const { favorites } = useAppSelector((state) => state.content)

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <Heart className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
            <p className="text-muted-foreground text-sm">
              Start adding content to your favorites by clicking the heart icon on any content card.
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <DragAndDropContentGrid
        items={favorites}
        title="Your Favorite Content"
        type="favorites"
        enableDragAndDrop={true}
        showLayoutToggle={true}
      />
    </motion.div>
  )
}
