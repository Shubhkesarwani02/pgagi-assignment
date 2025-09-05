"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchContent, fetchTrendingContent } from "@/lib/slices/content-slice"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { MainContent } from "./main-content"

export function Dashboard() {
  const dispatch = useAppDispatch()
  const { darkMode } = useAppSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchContent())
    dispatch(fetchTrendingContent())
  }, [dispatch])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex h-screen bg-gradient-to-br from-background via-background to-muted/20 text-foreground overflow-hidden"
    >
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <MainContent />
      </div>
    </motion.div>
  )
}
