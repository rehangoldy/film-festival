# Film Festival Frontend

Vue.js frontend application for the Film Festival platform.

## Tech Stack
- Vue.js 3
- Vue Router
- Pinia (State Management)
- Tailwind CSS
- Font Awesome
- Axios

## Project Structure
```
/client
  /public          # Static assets
  /src
    /assets        # Images, styles, etc.
    /components    # Reusable Vue components
      /movie        # Movie-related components
      /shared       # Shared/common components
    /router        # Vue Router configuration
    /stores        # Pinia state management
    /utils         # Utility functions
    /views         # Page components
```

## Features
- User authentication (login/register)
- Movie browsing with filters
- Movie detail pages with video player
- Voting system
- View tracking
- Admin dashboard
- Responsive design
- File upload for movies and thumbnails

## Components

### Movie Components
- `MovieCard.vue` - Display movie in grid/list
- `MoviePlayer.vue` - Custom video player
- `MovieVoteButton.vue` - Interactive vote button
- `MovieUploadForm.vue` - Form for movie upload

### Shared Components
- `Navbar.vue` - Main navigation
- `Pagination.vue` - Custom pagination
- `LoadingSpinner.vue` - Loading states
- `ErrorMessage.vue` - Error handling

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
Create `.env` file:
```env
VITE_API_URL=http://localhost:8080/api
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## File Upload Limits
- Videos: up to 2GB
- Images: up to 50MB

## State Management
Using Pinia stores:
- `auth.js` - User authentication
- `movie.js` - Movie data and operations
- `genre.js` - Genre management

## Router Configuration
- Protected routes for authenticated users
- Admin-only routes
- Route guards for authentication

## Development Guidelines

### Code Style
- Use Composition API with `<script setup>`
- Follow Vue.js Style Guide
- Use PascalCase for components
- Use kebab-case for custom events

### Component Structure
1. Props validation
2. Composables for logic
3. Computed properties for derived data
4. Event handlers
5. Lifecycle hooks

### Best Practices
- Lazy load routes and heavy components
- Use TypeScript for better type safety
- Keep components small and focused
- Document complex logic
- Use constants for magic values

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing
1. Follow existing code style
2. Test all changes
3. Update documentation
4. Create detailed PRs
