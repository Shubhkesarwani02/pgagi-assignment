"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Moon, Sun, ChevronDown, Filter, Bell, Settings, SlidersHorizontal } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { toggleDarkMode } from "@/lib/slices/user-slice"
import { setSearchQuery, searchContent, clearSearchResults, setSelectedCategory } from "@/lib/slices/content-slice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { debounce } from "lodash"

export function Header() {
  const dispatch = useAppDispatch()
  const { darkMode, user } = useAppSelector((state) => state.user)
  const { searchQuery, searchResults, categories, selectedCategory, loading } = useAppSelector((state) => state.content)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [searchFilters, setSearchFilters] = useState<string[]>(["news", "movie", "social"])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        dispatch(searchContent(query))
        setShowSearchResults(true)
      } else {
        dispatch(clearSearchResults())
        setShowSearchResults(false)
      }
    }, 300),
    [dispatch],
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchInput(query)
    dispatch(setSearchQuery(query))
    debouncedSearch(query)
  }

  const handleClearSearch = () => {
    setSearchInput("")
    dispatch(setSearchQuery(""))
    dispatch(clearSearchResults())
    setShowSearchResults(false)
  }

  // Sync search input with Redux state when component mounts or searchQuery changes externally
  useEffect(() => {
    setSearchInput(searchQuery)
  }, [searchQuery])

  const handleFilterToggle = (filter: string) => {
    setSearchFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const filteredSearchResults = searchResults.filter(item => 
    searchFilters.includes(item.type)
  )

  const searchTypes = [
    { value: "news", label: "News", count: searchResults.filter(item => item.type === "news").length },
    { value: "movie", label: "Movies", count: searchResults.filter(item => item.type === "movie").length },
    { value: "social", label: "Social", count: searchResults.filter(item => item.type === "social").length },
  ]

  useEffect(() => {
    const handleClickOutside = () => setShowSearchResults(false)
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <header className="h-16 bg-background/95 backdrop-blur-xl border-b border-border/50 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left Section - Logo and Category Filter */}
      <div className="flex items-center gap-4">
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">MD</span>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MyDash
          </span>
        </motion.div>

        <Select value={selectedCategory} onValueChange={(value) => dispatch(setSelectedCategory(value))}>
          <SelectTrigger className="w-32">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Center - Enhanced Search Bar with Filters */}
      <div className="flex-1 max-w-2xl mx-auto relative" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <motion.div
            className="relative flex-1"
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search across news, movies, and social posts..."
              className="pl-10 pr-12 w-full bg-background/50 border-border/50 focus:bg-background focus:border-primary/50 transition-all duration-200"
              value={searchInput}
              onChange={handleSearchChange}
              onFocus={() => searchInput && setShowSearchResults(true)}
            />
            {searchInput && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={handleClearSearch}
              >
                ×
              </Button>
            )}
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            )}
          </motion.div>

          {/* Search Filters */}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="relative"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {searchFilters.length < 3 && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Filter by content type</h4>
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
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                      >
                        {type.label}
                        {type.count > 0 && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                            {type.count}
                          </Badge>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <AnimatePresence>
          {showSearchResults && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 w-full bg-popover/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">Search Results</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {filteredSearchResults.length} of {searchResults.length}
                    </Badge>
                    {searchFilters.length < 3 && (
                      <Badge variant="outline" className="text-xs">
                        Filtered
                      </Badge>
                    )}
                  </div>
                </div>
                {filteredSearchResults.length > 0 ? (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {filteredSearchResults.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ backgroundColor: "var(--accent)", scale: 1.02 }}
                        className="p-3 rounded-lg cursor-pointer transition-all duration-200"
                        onClick={() => {
                          setShowSearchResults(false)
                          // Handle item click - could navigate or open modal
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={item.image || "/placeholder.svg?key=search"}
                              alt={item.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs px-1 py-0">
                              {item.type}
                            </Badge>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                              {item.source && <span className="text-xs text-muted-foreground">{item.source}</span>}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      No results match your current filters
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => setSearchFilters(["news", "movie", "social"])}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Section - Enhanced with notifications */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
            3
          </span>
        </Button>

        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>

        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleDarkMode())}
            className="relative overflow-hidden"
          >
            <motion.div
              initial={false}
              animate={{ rotate: darkMode ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.div>
          </Button>
        </motion.div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" className="flex items-center gap-2 px-2 h-10">
                <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                  <AvatarImage src={user?.avatar || "/placeholder.svg?key=avatar"} alt={user?.name} />
                  <AvatarFallback className="bg-blue-600 text-white font-semibold">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-popover/95 backdrop-blur-xl border-border/50">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{user?.name || "John Doe"}</p>
              <p className="text-xs text-muted-foreground">{user?.email || "john@example.com"}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <span>Preferences</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <span>Notifications</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600">
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
