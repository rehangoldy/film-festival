# Film Festival Backend API

Express.js backend for the Film Festival application.

## Tech Stack
- Node.js
- Express.js
- MySQL (Sequelize ORM)
- JWT Authentication
- Multer (File Upload)

## Project Structure
```
/server
  /config         # Database and other configuration files
  /controllers    # Request handlers
  /middleware     # Custom middleware (auth, upload, etc.)
  /models        # Sequelize models
  /routes        # API routes
  /utils         # Utility functions
  /uploads       # Uploaded files (videos & thumbnails)
```

## Environment Variables

The `.env` file contains sensitive information and should not be committed to the repository. Instead, we provide `.env.example` as a template.

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the values in `.env` with your configuration:
```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=your_username
DB_PASS=your_password
DB_NAME=v1_movie_festival_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# File Upload Configuration
MAX_FILE_SIZE=2048mb
UPLOAD_PATH=uploads/
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout user

### Movies
- `GET /api/movies` - Get all movies (with pagination)
- `GET /api/movies/:id` - Get single movie
- `POST /api/movies` - Upload new movie
- `PUT /api/movies/:id` - Update movie
- `DELETE /api/movies/:id` - Delete movie
- `POST /api/movies/:id/vote` - Vote/unvote movie
- `POST /api/movies/:id/view` - Track movie view

### Genres
- `GET /api/genres` - Get all genres
- `POST /api/genres` - Add new genre (admin only)

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
- Copy `.env.example` to `.env`
- Update the values in `.env` with your configuration

3. Configure database:
- Import database from `/database/v1_movie_festival_db.sql`
- Update database config in `.env`

4. Start development server:
```bash
npm run dev
```

5. For production:
```bash
npm start
```

## File Upload Configuration

Current maximum file size limits:
- Videos: 2GB
- Images: 50MB

To adjust these limits, modify:
1. Environment variables in `.env`
2. Multer configuration in middleware
3. Express body parser limits
4. Nginx upload limits (if using Nginx)

## Error Handling
- All errors are formatted consistently through error middleware
- Validation errors return 400 status
- Authentication errors return 401/403 status
- Not found errors return 404 status
- Server errors return 500 status

## Authentication
- Uses JWT (JSON Web Tokens)
- Tokens expire in 24 hours
- Protected routes use `auth.middleware.js`
- Admin routes use additional `admin.middleware.js`

## Development Guidelines
1. Use async/await for database operations
2. Validate all inputs
3. Use try-catch blocks for error handling
4. Keep controllers thin, logic in services
5. Document new endpoints in this README

## Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (if configured)
- `npm run lint` - Run ESLint
