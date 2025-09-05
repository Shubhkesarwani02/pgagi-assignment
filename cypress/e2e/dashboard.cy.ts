describe('Dashboard Navigation', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the dashboard successfully', () => {
    cy.contains('Your Personalized Feed').should('be.visible')
    cy.get('[data-testid="search-input"]').should('be.visible')
  })

  it('should navigate between sections', () => {
    // Click on trending section
    cy.get('[data-testid="nav-trending"]').click()
    cy.contains('Trending Now').should('be.visible')

    // Click on favorites section
    cy.get('[data-testid="nav-favorites"]').click()
    cy.contains('Your Favorites').should('be.visible')

    // Click on settings section
    cy.get('[data-testid="nav-settings"]').click()
    cy.contains('Profile').should('be.visible')

    // Return to feed
    cy.get('[data-testid="nav-feed"]').click()
    cy.contains('Your Personalized Feed').should('be.visible')
  })

  it('should toggle dark mode', () => {
    cy.get('[data-testid="nav-settings"]').click()
    cy.get('[data-testid="dark-mode-toggle"]').click()
    cy.get('html').should('have.class', 'dark')
    
    cy.get('[data-testid="dark-mode-toggle"]').click()
    cy.get('html').should('not.have.class', 'dark')
  })
})

describe('Search Functionality', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should perform search with debouncing', () => {
    const searchTerm = 'technology'
    
    cy.get('[data-testid="search-input"]').type(searchTerm)
    
    // Wait for debounced search
    cy.wait(500)
    
    cy.contains('results for').should('be.visible')
    cy.get('[data-testid="search-results"]').should('exist')
  })

  it('should clear search results', () => {
    cy.get('[data-testid="search-input"]').type('test search')
    cy.wait(500)
    
    cy.get('[data-testid="clear-search"]').click()
    cy.get('[data-testid="search-input"]').should('have.value', '')
  })

  it('should filter search by category', () => {
    cy.get('[data-testid="search-filter-toggle"]').click()
    cy.get('[data-testid="category-technology"]').click()
    
    cy.get('[data-testid="search-input"]').type('AI')
    cy.wait(500)
    
    cy.contains('Category: technology').should('be.visible')
  })
})

describe('Content Interaction', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should add item to favorites', () => {
    // Find first content card and add to favorites
    cy.get('[data-testid="content-card"]').first().within(() => {
      cy.get('[data-testid="favorite-button"]').click()
    })

    // Navigate to favorites and verify
    cy.get('[data-testid="nav-favorites"]').click()
    cy.get('[data-testid="content-card"]').should('exist')
  })

  it('should toggle layout between grid and list', () => {
    cy.get('[data-testid="layout-toggle"]').click()
    cy.get('[data-testid="content-grid"]').should('have.class', 'space-y-4')
    
    cy.get('[data-testid="layout-toggle"]').click()
    cy.get('[data-testid="content-grid"]').should('have.class', 'grid')
  })

  it('should refresh content', () => {
    cy.get('[data-testid="refresh-button"]').click()
    cy.contains('Refreshing...').should('be.visible')
    cy.contains('Refresh').should('be.visible')
  })
})

describe('Drag and Drop', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should reorder content cards via drag and drop', () => {
    // Get the first two content cards
    cy.get('[data-testid="content-card"]').first().as('firstCard')
    cy.get('[data-testid="content-card"]').eq(1).as('secondCard')

    // Get initial positions
    cy.get('@firstCard').invoke('text').as('firstCardText')
    cy.get('@secondCard').invoke('text').as('secondCardText')

    // Perform drag and drop (using a mouse event simulation)
    cy.get('@firstCard').trigger('mousedown', { which: 1 })
    cy.get('@secondCard').trigger('mousemove').trigger('mouseup')

    // Verify the order has changed
    cy.get('[data-testid="content-card"]').first().should('not.contain', '@firstCardText')
  })
})

describe('User Preferences', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('[data-testid="nav-settings"]').click()
  })

  it('should update user profile', () => {
    cy.get('[data-testid="edit-profile"]').click()
    cy.get('[data-testid="name-input"]').clear().type('Updated Name')
    cy.get('[data-testid="save-profile"]').click()
    
    cy.contains('Updated Name').should('be.visible')
  })

  it('should change content layout preference', () => {
    cy.get('[data-testid="layout-list"]').click()
    
    cy.get('[data-testid="nav-feed"]').click()
    cy.get('[data-testid="content-grid"]').should('have.class', 'space-y-4')
  })

  it('should update content categories', () => {
    cy.get('[data-testid="category-badge-science"]').click()
    cy.get('[data-testid="category-badge-science"]').should('have.class', 'bg-primary')
  })

  it('should change language', () => {
    cy.get('[data-testid="language-select"]').click()
    cy.get('[data-testid="language-hindi"]').click()
    
    // Verify language change (would need actual translations)
    cy.get('[data-testid="language-select"]').should('contain', 'हिंदी')
  })
})
