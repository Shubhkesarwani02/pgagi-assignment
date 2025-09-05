"use client"

import { motion } from "framer-motion"
import { useAppSelector } from "@/lib/hooks"
import { ContentCard } from "./content-card"
import { TrendingUp } from "lucide-react"

export function TrendingSection() {
  const { trending } = useAppSelector((state) => state.content)

  if (trending.length === 0) return null

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-6"
      >
        <TrendingUp className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Trending Now</h2>
      </motion.div>

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {trending.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 w-80"
          >
            <ContentCard item={item} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
