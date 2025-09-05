"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { Grid, List, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { reorderContent, reorderFavorites, type ContentItem } from "@/lib/slices/content-slice"
import { setContentLayout } from "@/lib/slices/user-slice"
import { DraggableContentCard } from "./draggable-content-card"
import { LoadingSpinner } from "./loading-spinner"

interface DragAndDropContentGridProps {
  items: ContentItem[]
  title: string
  type?: "content" | "favorites"
  enableDragAndDrop?: boolean
  showLayoutToggle?: boolean
}

export function DragAndDropContentGrid({ 
  items, 
  title, 
  type = "content",
  enableDragAndDrop = true,
  showLayoutToggle = true 
}: DragAndDropContentGridProps) {
  const dispatch = useAppDispatch()
  const { layout } = useAppSelector((state) => state.user)
  const { loading } = useAppSelector((state) => state.content)
  const [localItems, setLocalItems] = useState(items)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Update local items when props change
  useEffect(() => {
    setLocalItems(items)
  }, [items])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setLocalItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)
        
        const newItems = arrayMove(items, oldIndex, newIndex)
        
        // Dispatch to Redux store
        if (type === "favorites") {
          dispatch(reorderFavorites({ fromIndex: oldIndex, toIndex: newIndex }))
        } else {
          dispatch(reorderContent({ fromIndex: oldIndex, toIndex: newIndex }))
        }
        
        return newItems
      })
    }
  }

  const handleLayoutToggle = () => {
    const newLayout = layout.contentLayout === "grid" ? "list" : "grid"
    dispatch(setContentLayout(newLayout))
  }

  const handleResetOrder = () => {
    setLocalItems([...items].sort((a, b) => 
      new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
    ))
  }

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-muted-foreground"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Grid className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium mb-2">No {title.toLowerCase()} found</h3>
          <p className="text-sm">
            {type === "favorites" 
              ? "Start adding items to your favorites to see them here."
              : "Try adjusting your search or category filters."
            }
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        
        <div className="flex items-center gap-2">
          {enableDragAndDrop && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetOrder}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Order
            </Button>
          )}
          
          {showLayoutToggle && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLayoutToggle}
              className="flex items-center gap-2"
            >
              {layout.contentLayout === "grid" ? (
                <>
                  <List className="w-4 h-4" />
                  List
                </>
              ) : (
                <>
                  <Grid className="w-4 h-4" />
                  Grid
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={localItems.map(item => item.id)}
          strategy={rectSortingStrategy}
        >
          <motion.div
            layout
            className={`${
              layout.contentLayout === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }`}
          >
            <AnimatePresence>
              {localItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <DraggableContentCard
                    item={item}
                    layout={layout.contentLayout}
                    isDragEnabled={enableDragAndDrop}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </SortableContext>
      </DndContext>

      {/* Drag instructions */}
      {enableDragAndDrop && items.length > 1 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground text-center mt-4"
        >
          💡 Drag and drop cards to reorder them
        </motion.p>
      )}
    </div>
  )
}
