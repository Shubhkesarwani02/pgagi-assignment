"use client"

import { motion } from "framer-motion"
import { useAppSelector } from "@/lib/hooks"
import { DragAndDropContentGrid } from "./drag-drop-content-grid"
import { TrendingUp } from "lucide-react"

export function TrendingSection() {
  const { trending } = useAppSelector((state) => state.content)

  if (trending.length === 0) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">No trending content</h3>
            <p className="text-muted-foreground text-sm">
              Check back later for trending content across all categories.
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
        items={trending}
        title="Trending Content"
        type="content"
        enableDragAndDrop={false} // Trending content order should be maintained
        showLayoutToggle={true}
      />
    </motion.div>
  )
}
