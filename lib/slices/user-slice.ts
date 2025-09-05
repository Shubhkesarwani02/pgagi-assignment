import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UserState {
  darkMode: boolean
  activeSection: "feed" | "trending" | "favorites" | "settings"
  preferences: {
    categories: string[]
    language: "en" | "hi"
  }
  isAuthenticated: boolean
  user: {
    name: string
    email: string
    avatar: string
  } | null
}

const initialState: UserState = {
  darkMode: false,
  activeSection: "feed",
  preferences: {
    categories: ["technology", "entertainment", "environment"],
    language: "en",
  },
  isAuthenticated: true, // Mock authentication
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/diverse-user-avatars.png",
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
  },
})

export const { toggleDarkMode, setActiveSection, updatePreferences, setLanguage } = userSlice.actions
