"use client"

import { Provider } from "react-redux"
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from "@/lib/store"
import { Dashboard } from "@/components/dashboard"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function Home() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <Dashboard />
      </PersistGate>
    </Provider>
  )
}
