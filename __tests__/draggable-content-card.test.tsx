import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { contentSlice } from '@/lib/slices/content-slice'
import { userSlice } from '@/lib/slices/user-slice'
import { DraggableContentCard } from '@/components/draggable-content-card'
import { DndContext } from '@dnd-kit/core'
import type { ContentItem } from '@/lib/slices/content-slice'

// Mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      content: contentSlice.reducer,
      user: userSlice.reducer,
    },
    preloadedState: {
      content: {
        items: [],
        trending: [],
        favorites: [],
        loading: false,
        searchResults: [],
        searchQuery: '',
        categories: ['all', 'technology'],
        selectedCategory: 'all',
        error: null,
        hasMore: true,
        page: 1,
      },
      user: {
        darkMode: false,
        activeSection: 'feed' as const,
        preferences: {
          categories: ['technology'],
          language: 'en' as const,
          autoRefresh: true,
          notifications: true,
          itemsPerPage: 12,
        },
        isAuthenticated: true,
        user: {
          name: 'Test User',
          email: 'test@example.com',
          avatar: '/test-avatar.jpg',
        },
        layout: {
          sidebarCollapsed: false,
          contentLayout: 'grid' as const,
        },
      },
    },
  })
}

const mockContentItem: ContentItem = {
  id: 'test-1',
  type: 'news',
  title: 'Test News Article',
  description: 'This is a test news article description',
  image: '/test-image.jpg',
  category: 'technology',
  source: 'Test Source',
  publishedAt: '2024-01-01T00:00:00Z',
  url: 'https://example.com/test-article',
  isFavorite: false,
}

const renderWithStoreAndDnd = (component: React.ReactElement) => {
  const store = createMockStore()
  return render(
    <Provider store={store}>
      <DndContext>
        {component}
      </DndContext>
    </Provider>
  )
}

describe('DraggableContentCard', () => {
  it('renders content item correctly', () => {
    renderWithStoreAndDnd(
      <DraggableContentCard item={mockContentItem} />
    )
    
    expect(screen.getByText('Test News Article')).toBeDefined()
    expect(screen.getByText('This is a test news article description')).toBeDefined()
  })

  it('shows favorite button', () => {
    renderWithStoreAndDnd(
      <DraggableContentCard item={mockContentItem} />
    )
    
    const favoriteButtons = screen.getAllByRole('button')
    const favoriteButton = favoriteButtons.find(button => 
      button.getAttribute('class')?.includes('absolute')
    )
    expect(favoriteButton).toBeDefined()
  })

  it('renders news type badge', () => {
    renderWithStoreAndDnd(
      <DraggableContentCard item={mockContentItem} />
    )
    
    expect(screen.getByText('news')).toBeDefined()
  })

  it('renders in list layout', () => {
    renderWithStoreAndDnd(
      <DraggableContentCard item={mockContentItem} layout="list" />
    )
    
    const card = screen.getByText('Test News Article').closest('.flex')
    expect(card?.className).toContain('flex-row')
  })

  it('disables drag when isDragEnabled is false', () => {
    renderWithStoreAndDnd(
      <DraggableContentCard item={mockContentItem} isDragEnabled={false} />
    )
    
    const cardContainer = screen.getByText('Test News Article').closest('[style]')
    expect(cardContainer?.getAttribute('style')).toContain('cursor-pointer')
  })
})
