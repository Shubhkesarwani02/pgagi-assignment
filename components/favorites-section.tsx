"use client"

import { motion } from "framer-motion"
import { useAppSelector } from "@/lib/hooks"
import { ContentCard } from "./content-card"
import { Heart } from "lucide-react"

export function FavoritesSection() {
  const { favorites } = useAppSelector((state) => state.content)

  if (favorites.length === 0) return null

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-6"
      >
        <Heart className="h-6 w-6 text-red-500" />
        <h2 className="text-2xl font-bold">Your Favorites</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ContentCard item={item} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
