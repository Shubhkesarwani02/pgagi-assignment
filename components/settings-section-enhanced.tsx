"use client"

import { motion } from "framer-motion"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { 
  toggleDarkMode, 
  updatePreferences, 
  setLanguage, 
  updateUserProfile,
  setContentLayout 
} from "@/lib/slices/user-slice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { 
  Moon, 
  Sun, 
  Globe, 
  Bell, 
  Shield, 
  Palette, 
  User, 
  Layout,
  Grid,
  List,
  Settings,
  RefreshCw,
  Eye,
  Edit,
  Save,
  X
} from "lucide-react"
import { useState } from "react"

const categories = ["technology", "entertainment", "business", "health", "science", "sports"]

export function SettingsSection() {
  const dispatch = useAppDispatch()
  const { darkMode, preferences, user, layout } = useAppSelector((state) => state.user)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })

  const handleCategoryToggle = (category: string) => {
    const newCategories = preferences.categories.includes(category)
      ? preferences.categories.filter((c) => c !== category)
      : [...preferences.categories, category]

    dispatch(updatePreferences({ categories: newCategories }))
  }

  const handleProfileUpdate = () => {
    dispatch(updateUserProfile(editForm))
    setIsEditing(false)
  }

  const handleItemsPerPageChange = (value: number[]) => {
    dispatch(updatePreferences({ itemsPerPage: value[0] }))
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* User Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
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
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Full Name"
                    />
                    <Input
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      placeholder="Email"
                      type="email"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleProfileUpdate}>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{user?.name}</h3>
                      <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Layout & Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Layout & Appearance
            </CardTitle>
            <CardDescription>Customize the look and feel of your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={() => dispatch(toggleDarkMode())} />
            </div>

            <div className="space-y-2">
              <Label>Content Layout</Label>
              <div className="flex gap-2">
                <Button
                  variant={layout.contentLayout === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => dispatch(setContentLayout("grid"))}
                  className="flex items-center gap-2"
                >
                  <Grid className="w-4 h-4" />
                  Grid
                </Button>
                <Button
                  variant={layout.contentLayout === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => dispatch(setContentLayout("list"))}
                  className="flex items-center gap-2"
                >
                  <List className="w-4 h-4" />
                  List
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Items per page: {preferences.itemsPerPage}</Label>
              <Slider
                value={[preferences.itemsPerPage]}
                onValueChange={handleItemsPerPageChange}
                max={24}
                min={6}
                step={3}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>6</span>
                <span>24</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Language & Region */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Language & Region
            </CardTitle>
            <CardDescription>Set your preferred language and regional settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={preferences.language} onValueChange={(value: "en" | "hi") => dispatch(setLanguage(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                  <SelectItem value="hi">🇮🇳 हिंदी (Hindi)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Content Preferences
            </CardTitle>
            <CardDescription>Choose the types of content you want to see in your feed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Favorite Categories</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={preferences.categories.includes(category) ? "default" : "secondary"}
                    className="cursor-pointer transition-colors"
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Selected: {preferences.categories.length} of {categories.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications & Updates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications & Updates
            </CardTitle>
            <CardDescription>Control how you receive updates and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <Label htmlFor="notifications">Push Notifications</Label>
              </div>
              <Switch 
                id="notifications" 
                checked={preferences.notifications} 
                onCheckedChange={(checked) => dispatch(updatePreferences({ notifications: checked }))} 
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                <Label htmlFor="auto-refresh">Auto-refresh Content</Label>
              </div>
              <Switch 
                id="auto-refresh" 
                checked={preferences.autoRefresh} 
                onCheckedChange={(checked) => dispatch(updatePreferences({ autoRefresh: checked }))} 
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Privacy & Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
            <CardDescription>Manage your privacy settings and account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              <Shield className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              <Eye className="w-4 h-4 mr-2" />
              Privacy Settings
            </Button>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
