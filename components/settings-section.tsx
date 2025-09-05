"use client"

import { motion } from "framer-motion"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { toggleDarkMode, updatePreferences, setLanguage } from "@/lib/slices/user-slice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Moon, Sun, Globe, Bell, Shield, Palette, User } from "lucide-react"

const categories = ["technology", "entertainment", "business", "health", "science", "sports"]

export function SettingsSection() {
  const dispatch = useAppDispatch()
  const { darkMode, preferences, user } = useAppSelector((state) => state.user)

  const handleCategoryToggle = (category: string) => {
    const newCategories = preferences.categories.includes(category)
      ? preferences.categories.filter((c) => c !== category)
      : [...preferences.categories, category]

    dispatch(updatePreferences({ categories: newCategories }))
  }

  return (
    <div className="space-y-6">
      {/* User Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {user?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h3 className="font-semibold">{user?.name}</h3>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel of your dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <Label htmlFor="dark-mode">Dark Mode</Label>
            </div>
            <Switch id="dark-mode" checked={darkMode} onCheckedChange={() => dispatch(toggleDarkMode())} />
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Language & Region
          </CardTitle>
          <CardDescription>Set your preferred language</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={preferences.language} onValueChange={(value: "en" | "hi") => dispatch(setLanguage(value))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Content Preferences
          </CardTitle>
          <CardDescription>Choose the types of content you want to see</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Favorite Categories</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((category) => (
                <motion.div key={category} whileTap={{ scale: 0.95 }}>
                  <Badge
                    variant={preferences.categories.includes(category) ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>Manage your privacy settings and data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              Clear Search History
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              Export Data
            </Button>
            <Button variant="destructive" className="w-full justify-start">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
