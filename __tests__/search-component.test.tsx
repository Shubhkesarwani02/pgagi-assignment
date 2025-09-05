import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { contentSlice } from '@/lib/slices/content-slice'
import { userSlice } from '@/lib/slices/user-slice'
import { SearchComponent } from '@/components/search-component'
import '@testing-library/jest-dom'

// Mock store
const createMockStore = (initialState = {}) => {
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
        categories: ['all', 'technology', 'entertainment'],
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
      ...initialState,
    },
  })
}

const renderWithStore = (component: React.ReactElement, store = createMockStore()) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  )
}

describe('SearchComponent', () => {
  it('renders search input correctly', () => {
    renderWithStore(<SearchComponent />)
    
    const searchInput = screen.getByPlaceholderText(/search for news, movies/i)
    expect(searchInput).toBeInTheDocument()
  })

  it('handles search input changes', async () => {
    renderWithStore(<SearchComponent />)
    
    const searchInput = screen.getByPlaceholderText(/search for news, movies/i)
    
    fireEvent.change(searchInput, { target: { value: 'test search' } })
    
    expect(searchInput).toHaveValue('test search')
  })

  it('shows clear button when there is input', async () => {
    renderWithStore(<SearchComponent />)
    
    const searchInput = screen.getByPlaceholderText(/search for news, movies/i)
    
    fireEvent.change(searchInput, { target: { value: 'test' } })
    
    await waitFor(() => {
      const clearButton = screen.getByRole('button')
      expect(clearButton).toBeInTheDocument()
    })
  })

  it('clears search when clear button is clicked', async () => {
    renderWithStore(<SearchComponent />)
    
    const searchInput = screen.getByPlaceholderText(/search for news, movies/i)
    
    fireEvent.change(searchInput, { target: { value: 'test' } })
    
    await waitFor(() => {
      const clearButton = screen.getByRole('button')
      fireEvent.click(clearButton)
    })
    
    expect(searchInput).toHaveValue('')
  })
})
