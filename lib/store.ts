import { configureStore } from "@reduxjs/toolkit"
import { contentSlice } from "./slices/content-slice"
import { userSlice } from "./slices/user-slice"

export const store = configureStore({
  reducer: {
    content: contentSlice.reducer,
    user: userSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
