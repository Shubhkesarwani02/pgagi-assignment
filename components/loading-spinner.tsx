"use client"

import { motion } from "framer-motion"

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <p className="text-muted-foreground">Loading your personalized content...</p>
    </div>
  )
}
