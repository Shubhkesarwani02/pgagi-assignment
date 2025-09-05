# Personalized Content Dashboard 🚀

A modern, interactive content dashboard built with Next.js, React, TypeScript, and Redux Toolkit. This application provides users with a personalized feed of news, movie recommendations, and social media content with advanced features like drag-and-drop reordering, real-time search, and comprehensive customization options.

![Dashboard Preview](./public/dashboard-preview.png)

## 🌟 Features

### ✨ Core Features
- **Personalized Content Feed**: Dynamic content from News API, TMDB API, and social media sources
- **Smart Search**: Debounced search with category filtering and advanced options
- **Interactive Content Cards**: Rich cards with images, descriptions, and call-to-action buttons
- **Infinite Scrolling**: Efficient content loading with pagination
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### 🎯 Advanced Features
- **Drag & Drop Reordering**: Intuitive content organization using @dnd-kit
- **Dark Mode**: Smooth theme switching with system preference detection
- **Layout Switching**: Toggle between grid and list views
- **Favorites System**: Save and organize your favorite content
- **Real-time Updates**: Auto-refresh functionality with user controls
- **Multi-language Support**: English and Hindi language options

### 🔧 Technical Features
- **Redux Toolkit**: Comprehensive state management with persistence
- **Framer Motion**: Smooth animations and transitions
- **TypeScript**: Full type safety throughout the application
- **Testing Suite**: Unit tests, integration tests, and E2E testing
- **PWA Ready**: Progressive Web App capabilities
- **API Integration**: Multiple external APIs with fallback mock data

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom Components
- **State Management**: Redux Toolkit with Redux Persist
- **Animations**: Framer Motion
- **Drag & Drop**: @dnd-kit
- **Testing**: Jest + React Testing Library + Cypress
- **Package Manager**: npm/pnpm

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shubhkesarwani02/pgagi-assignment.git
   cd pgagi-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys to `.env.local`:
   ```env
   NEWS_API_KEY=your_news_api_key_here
   TMDB_API_KEY=your_tmdb_api_key_here
   NEXTAUTH_SECRET=your_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage Guide

### Navigation
- **Feed**: Main personalized content stream
- **Trending**: Popular content across all categories
- **Favorites**: Your saved content items
- **Settings**: Customize your experience

### Content Interaction
- **❤️ Favorite**: Click the heart icon to save content
- **🔍 Search**: Use the search bar with real-time filtering
- **🎯 Filter**: Apply category and content type filters
- **🔄 Refresh**: Get the latest content updates
- **📱 Layout**: Switch between grid and list views

### Drag & Drop
- **Reorder Content**: Drag content cards to rearrange them
- **Organize Favorites**: Custom order your favorite items
- **Visual Feedback**: Smooth animations during interactions

### Customization
- **🌙 Dark Mode**: Toggle between light and dark themes
- **🌍 Language**: Switch between English and Hindi
- **⚙️ Preferences**: Set favorite categories and notification preferences
- **👤 Profile**: Update your personal information

## 🧪 Testing

### Unit Tests
```bash
npm run test
# Run with watch mode
npm run test:watch
# Generate coverage report
npm run test:coverage
```

### E2E Tests
```bash
# Open Cypress Test Runner
npm run test:e2e
# Run headless E2E tests
npm run test:e2e:headless
```

### Type Checking
```bash
npm run type-check
```

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── drag-drop-content-grid.tsx
│   ├── draggable-content-card.tsx
│   ├── search-component.tsx
│   └── ...
├── lib/                   # Utility libraries
│   ├── api/              # API integration
│   ├── slices/           # Redux slices
│   ├── hooks.ts          # Custom hooks
│   ├── store.ts          # Redux store configuration
│   └── utils.ts          # Utility functions
├── public/               # Static assets
├── __tests__/            # Test files
├── cypress/              # E2E tests
└── styles/               # Additional styles
```

## 🔌 API Integration

### News API
- **Endpoint**: `/api/news`
- **Features**: Category filtering, search, pagination
- **Fallback**: Mock data when API is unavailable

### TMDB API (Movies)
- **Endpoint**: `/api/movies`
- **Features**: Popular movies, trending content, search
- **Fallback**: Mock movie data

### Social Media (Mock)
- **Endpoint**: Mock implementation
- **Features**: Hashtag filtering, user posts
- **Purpose**: Demonstration of social media integration

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6)
- **Secondary**: Purple (#8b5cf6)
- **Accent**: Green (#10b981)
- **Dark Mode**: Automatic theme switching

### Typography
- **Headings**: Inter font family
- **Body**: System font stack
- **Code**: Fira Code

### Spacing
- **Grid**: 4px base unit
- **Components**: Consistent padding and margins
- **Responsive**: Mobile-first approach

## 🔄 State Management

### Redux Store Structure
```typescript
interface RootState {
  content: {
    items: ContentItem[]
    trending: ContentItem[]
    favorites: ContentItem[]
    searchResults: ContentItem[]
    // ... more state
  }
  user: {
    preferences: UserPreferences
    layout: LayoutSettings
    // ... more state
  }
}
```

### Persistence
- User preferences and favorites are persisted
- Session management with Redux Persist
- Automatic rehydration on app load

## 🌐 Internationalization

### Supported Languages
- **English (en)**: Default language
- **Hindi (hi)**: Full translation support

### Adding New Languages
1. Add language option to user slice
2. Create translation files
3. Update language selector component
4. Test with different locales

## 📊 Performance Optimizations

### Code Splitting
- Route-based code splitting with Next.js
- Component lazy loading where applicable
- Dynamic imports for heavy libraries

### Image Optimization
- Next.js Image component with optimization
- Lazy loading for content images
- Fallback images for missing content

### Caching
- API response caching
- Redux state persistence
- Browser caching strategies

## 🛡️ Security Features

### Data Protection
- Environment variable validation
- API key security
- Input sanitization

### Authentication Ready
- NextAuth.js integration prepared
- User session management
- Protected routes structure

## 📈 Analytics & Monitoring

### Performance Monitoring
- Vercel Analytics integration
- Core Web Vitals tracking
- Error boundary implementation

### User Analytics
- Feature usage tracking
- Search analytics
- Content interaction metrics

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel --prod
```

### Docker
```dockerfile
# Use the Dockerfile in the project root
docker build -t content-dashboard .
docker run -p 3000:3000 content-dashboard
```

### Environment Variables
Set these in your deployment platform:
- `NEWS_API_KEY`
- `TMDB_API_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

### Code Style
- ESLint and Prettier configuration
- TypeScript strict mode
- Consistent component patterns
- Comprehensive documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Assignment Requirements Checklist

### ✅ Core Features
- [x] Personalized Content Feed
- [x] User Preferences with Local Storage
- [x] Multiple API Integration (News, Movies, Social)
- [x] Interactive Content Cards
- [x] Infinite Scrolling/Pagination

### ✅ Dashboard Layout
- [x] Responsive Layout with Sidebar
- [x] Header with Search and Settings
- [x] Personalized Feed Section
- [x] Trending Section
- [x] Favorites Section

### ✅ Search Functionality
- [x] Search Bar Implementation
- [x] Debounced Search
- [x] Cross-category Search

### ✅ Advanced UI/UX
- [x] Drag-and-Drop Content Organization
- [x] Dark Mode Toggle
- [x] Smooth Animations (Framer Motion)
- [x] Loading Spinners and Transitions

### ✅ State Management
- [x] Redux Toolkit Implementation
- [x] Async Logic with Thunks
- [x] Local Storage Persistence

### ✅ Testing
- [x] Unit Tests (Jest + React Testing Library)
- [x] Integration Tests
- [x] E2E Tests (Cypress)

### ✅ Bonus Features
- [x] User Profile Management
- [x] Multi-language Support
- [x] Layout Customization
- [x] Advanced Filtering

## 🏆 Demo

### Live Demo
🔗 [Live Application](https://your-deployment-url.vercel.app)

### Demo Video
📹 [Watch Demo Video](https://your-demo-video-link.com)

### Screenshots
![Dashboard](./public/screenshots/dashboard.png)
![Dark Mode](./public/screenshots/dark-mode.png)
![Mobile View](./public/screenshots/mobile.png)

## 📞 Contact

**Developer**: Shubh Kesarwani  
**Email**: shubhkesarwani02@gmail.com  
**GitHub**: [@Shubhkesarwani02](https://github.com/Shubhkesarwani02)  
**LinkedIn**: [Shubh Kesarwani](https://linkedin.com/in/shubhkesarwani)

---

⭐ **Star this repository if you found it helpful!**
