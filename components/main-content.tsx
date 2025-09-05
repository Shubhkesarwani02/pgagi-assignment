"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { fetchContent, fetchTrendingContent } from "@/lib/slices/content-slice"
import { ContentCard } from "./content-card"
import { TrendingSection } from "./trending-section"
import { FavoritesSection } from "./favorites-section"
import { SettingsSection } from "./settings-section"
import { LoadingSpinner } from "./loading-spinner"
import { Button } from "@/components/ui/button"
import { RefreshCw, Filter, Grid3X3, List, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type ViewMode = "grid" | "list"

export function MainContent() {
  const dispatch = useAppDispatch()
  const { items, loading, searchResults, searchQuery, selectedCategory, error } = useAppSelector(
    (state) => state.content,
  )
  const { activeSection } = useAppSelector((state) => state.user)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    dispatch(fetchContent({ category: selectedCategory }))
    dispatch(fetchTrendingContent())
  }, [dispatch, selectedCategory])

  const handleRefresh = async () => {
    setRefreshing(true)
    await dispatch(fetchContent({ category: selectedCategory, refresh: true }))
    await dispatch(fetchTrendingContent())
    setTimeout(() => setRefreshing(false), 1000)
  }

  const displayItems = searchQuery ? searchResults : items
  const hasContent = displayItems.length > 0

  if (loading && !refreshing) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <LoadingSpinner />
        </motion.div>
      </div>
    )
  }

  const renderSection = () => {
    switch (activeSection) {
      case "trending":
        return (
          <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Trending Now
              </h2>
              <p className="text-muted-foreground">Most popular content across all categories</p>
            </motion.div>
            <TrendingSection />
          </div>
        )

      case "favorites":
        return (
          <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Your Favorites
              </h2>
              <p className="text-muted-foreground">Content you've saved for later</p>
            </motion.div>
            <FavoritesSection />
          </div>
        )

      case "settings":
        return (
          <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Settings
              </h2>
              <p className="text-muted-foreground">Customize your dashboard experience</p>
            </motion.div>
            <SettingsSection />
          </div>
        )

      default: // feed
        return (
          <div className="p-6 space-y-8 max-w-7xl mx-auto">
            {!searchQuery && (
              <>
                <TrendingSection />

                <motion.div
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <motion.h2
                        className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
                        whileHover={{ scale: 1.02 }}
                      >
                        Personalized Feed
                      </motion.h2>
                      <Badge variant="secondary" className="px-3 py-1">
                        {items.length} items
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">Curated content from news, movies, and social media</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-muted/50 rounded-lg p-1">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="h-8 px-3"
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="h-8 px-3"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>

                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="gap-2 bg-transparent"
                      >
                        <motion.div
                          animate={{ rotate: refreshing ? 360 : 0 }}
                          transition={{
                            duration: 1,
                            repeat: refreshing ? Number.POSITIVE_INFINITY : 0,
                            ease: "linear",
                          }}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </motion.div>
                        Refresh
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </>
            )}

            {searchQuery && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-bold">Search Results</h2>
                  <Badge variant="secondary" className="px-3 py-1">
                    {searchResults.length} found
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Results for "<span className="font-medium text-foreground">{searchQuery}</span>"
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center"
              >
                <p className="text-destructive font-medium">Failed to load content</p>
                <p className="text-muted-foreground text-sm mt-1">{error}</p>
                <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-3 bg-transparent">
                  Try Again
                </Button>
              </motion.div>
            )}

            {hasContent && (
              <motion.section layout className="space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={viewMode}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "gap-6",
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "flex flex-col",
                    )}
                  >
                    {displayItems.map((item, index) => (
                      <ContentCard key={item.id} item={item} index={index} />
                    ))}
                  </motion.div>
                </AnimatePresence>

                {!searchQuery && items.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center pt-8"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="gap-2 bg-background/50 backdrop-blur-sm"
                      onClick={() => dispatch(fetchContent({ category: selectedCategory }))}
                    >
                      <Zap className="h-4 w-4" />
                      Load More Content
                    </Button>
                  </motion.div>
                )}
              </motion.section>
            )}

            {!hasContent && !loading && !error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 space-y-4"
              >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Filter className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No content found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {searchQuery
                      ? `No results found for "${searchQuery}". Try a different search term.`
                      : "No content available for the selected category. Try refreshing or selecting a different category."}
                  </p>
                </div>
                <Button variant="outline" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Content
                </Button>
              </motion.div>
            )}

            {/* Favorites Section */}
            {!searchQuery && <FavoritesSection />}
          </div>
        )
    }
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
