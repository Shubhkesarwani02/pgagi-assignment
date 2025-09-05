"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { fetchContent, fetchTrendingContent } from "@/lib/slices/content-slice"
import { DragAndDropContentGrid } from "./drag-drop-content-grid"
import { SearchComponent } from "./search-component"
import { TrendingSection } from "./trending-section"
import { FavoritesSection } from "./favorites-section"
import { SettingsSection } from "./settings-section"
import { LoadingSpinner } from "./loading-spinner"
import { Button } from "@/components/ui/button"
import { RefreshCw, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function MainContent() {
  const dispatch = useAppDispatch()
  const { items, loading, searchResults, searchQuery, selectedCategory, error } = useAppSelector(
    (state) => state.content,
  )
  const { activeSection, preferences } = useAppSelector((state) => state.user)
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
            {/* Search Component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <SearchComponent />
            </motion.div>

            {/* Header Section */}
            {!searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Your Personalized Feed
                  </h2>
                  <div className="flex items-center gap-2">
                    <p className="text-muted-foreground">
                      Showing content for: 
                    </p>
                    <Badge variant="secondary" className="capitalize">
                      {selectedCategory === "all" ? "All Categories" : selectedCategory}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                    {refreshing ? "Refreshing..." : "Refresh"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-destructive/10 border border-destructive/20 rounded-lg p-4"
                >
                  <p className="text-destructive text-sm">
                    <Zap className="w-4 h-4 inline mr-2" />
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {hasContent ? (
                <DragAndDropContentGrid
                  items={displayItems}
                  title={searchQuery ? `Search Results` : "Latest Content"}
                  type="content"
                  enableDragAndDrop={!searchQuery} // Disable drag for search results
                  showLayoutToggle={true}
                />
              ) : (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                      <Zap className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        {searchQuery ? "No search results found" : "No content available"}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {searchQuery 
                          ? `Try searching for something else or adjust your filters.`
                          : `Try refreshing the page or check your internet connection.`
                        }
                      </p>
                    </div>
                    {!searchQuery && (
                      <Button onClick={handleRefresh} variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                      </Button>
                    )}
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        )
    }
  }

  return (
    <main className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-muted/20">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-full"
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
