import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UserState {
  darkMode: boolean
  activeSection: "feed" | "trending" | "favorites" | "settings"
  preferences: {
    categories: string[]
    language: "en" | "hi"
    autoRefresh: boolean
    notifications: boolean
    itemsPerPage: number
  }
  isAuthenticated: boolean
  user: {
    name: string
    email: string
    avatar: string
  } | null
  layout: {
    sidebarCollapsed: boolean
    contentLayout: "grid" | "list"
  }
}

const initialState: UserState = {
  darkMode: false,
  activeSection: "feed",
  preferences: {
    categories: ["technology", "entertainment", "science"],
    language: "en",
    autoRefresh: true,
    notifications: true,
    itemsPerPage: 12,
  },
  isAuthenticated: true, // Mock authentication
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/diverse-user-avatars.png",
  },
  layout: {
    sidebarCollapsed: false,
    contentLayout: "grid",
  },
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
    },
    setActiveSection: (state, action: PayloadAction<"feed" | "trending" | "favorites" | "settings">) => {
      state.activeSection = action.payload
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserState["preferences"]>>) => {
      state.preferences = { ...state.preferences, ...action.payload }
    },
    setLanguage: (state, action: PayloadAction<"en" | "hi">) => {
      state.preferences.language = action.payload
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserState["user"]>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    toggleSidebar: (state) => {
      state.layout.sidebarCollapsed = !state.layout.sidebarCollapsed
    },
    setContentLayout: (state, action: PayloadAction<"grid" | "list">) => {
      state.layout.contentLayout = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
    },
    login: (state, action: PayloadAction<UserState["user"]>) => {
      state.isAuthenticated = true
      state.user = action.payload
    },
  },
})

export const { 
  toggleDarkMode, 
  setActiveSection, 
  updatePreferences, 
  setLanguage,
  updateUserProfile,
  toggleSidebar,
  setContentLayout,
  logout,
  login,
} = userSlice.actions
