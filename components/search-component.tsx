"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, X, Filter, SlidersHorizontal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setSearchQuery, searchContent, clearSearchResults, setSelectedCategory } from "@/lib/slices/content-slice"
import { debounce } from "lodash"

export function SearchComponent() {
  const dispatch = useAppDispatch()
  const { searchQuery, searchResults, categories, selectedCategory, loading } = useAppSelector((state) => state.content)
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const [searchFilters, setSearchFilters] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      dispatch(setSearchQuery(query))
      if (query.trim()) {
        dispatch(searchContent(query))
      } else {
        dispatch(clearSearchResults())
      }
    }, 300),
    [dispatch]
  )

  useEffect(() => {
    debouncedSearch(localQuery)
    return () => {
      debouncedSearch.cancel()
    }
  }, [localQuery, debouncedSearch])

  const handleClearSearch = () => {
    setLocalQuery("")
    dispatch(clearSearchResults())
    dispatch(setSearchQuery(""))
  }

  const handleCategoryChange = (category: string) => {
    dispatch(setSelectedCategory(category))
  }

  const handleFilterToggle = (filter: string) => {
    setSearchFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const searchTypes = [
    { value: "news", label: "News" },
    { value: "movie", label: "Movies" },
    { value: "social", label: "Social" },
  ]

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors ${
            loading ? 'animate-pulse text-primary' : ''
          }`} />
          <Input
            type="text"
            placeholder="Search for news, movies, or social posts..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="pl-10 pr-10 h-12 text-base"
            data-testid="search-input"
          />
          <AnimatePresence>
            {localQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="clear-search"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className={`h-12 w-12 ${searchFilters.length > 0 ? 'bg-primary text-primary-foreground' : ''}`}
              data-testid="search-filter-toggle"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-3">Search Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategory === category}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <label
                        htmlFor={category}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-3">Content Types</h4>
                <div className="space-y-2">
                  {searchTypes.map((type) => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.value}
                        checked={searchFilters.includes(type.value)}
                        onCheckedChange={() => handleFilterToggle(type.value)}
                      />
                      <label
                        htmlFor={type.value}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchFilters([])
                  handleCategoryChange("all")
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters */}
      <AnimatePresence>
        {(selectedCategory !== "all" || searchFilters.length > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mt-3"
          >
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {selectedCategory}
                <button onClick={() => handleCategoryChange("all")}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {searchFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                Type: {filter}
                <button onClick={() => handleFilterToggle(filter)}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results Count */}
      <AnimatePresence>
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-sm text-muted-foreground"
          >
            {loading ? (
              <span>Searching...</span>
            ) : (
              <span>
                {searchResults.length} results for "{searchQuery}"
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
