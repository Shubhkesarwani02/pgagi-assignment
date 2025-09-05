"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Home, TrendingUp, Heart, Settings, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setActiveSection } from "@/lib/slices/user-slice"

const navigation = [
  { name: "Feed", icon: Home, id: "feed" as const },
  { name: "Trending", icon: TrendingUp, id: "trending" as const },
  { name: "Favorites", icon: Heart, id: "favorites" as const },
  { name: "Settings", icon: Settings, id: "settings" as const },
]

export function Sidebar() {
  const dispatch = useAppDispatch()
  const { activeSection } = useAppSelector((state) => state.user)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleNavClick = (sectionId: typeof activeSection) => {
    dispatch(setActiveSection(sectionId))
    // Close mobile menu after selection
    if (window.innerWidth < 768) {
      setIsCollapsed(true)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-background/80 backdrop-blur-sm border"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: isCollapsed ? -280 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed md:relative z-40 h-full w-64 bg-sidebar/80 backdrop-blur-xl border-r border-sidebar-border",
          "md:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <h1 className="text-2xl font-bold text-sidebar-foreground">MyDash</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id

              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </motion.button>
              )
            })}
          </nav>
        </div>
      </motion.div>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsCollapsed(true)} />
      )}
    </>
  )
}
