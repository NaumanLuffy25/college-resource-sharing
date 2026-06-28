# CollegeHub - College Resource Sharing Platform

A modern, full-stack web platform where college students can upload, share, discover, rate, and download academic resources.

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **Vite** for build tooling
- **React Router v7** for routing
- **Zustand** for state management
- **Axios** for API calls
- **Lucide React** for icons
- **Framer Motion** for animations
- **React Hot Toast** for notifications

### Backend
- **Node.js** with **Express.js**
- **TypeScript**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **Helmet** for security headers
- **CORS** configuration
- **Rate limiting**

## Features

### Core Features
- User registration & login with JWT authentication
- Role-based access control (Student, Moderator, Admin)
- Resource upload (PDF, DOCX, PPTX, ZIP, Images)
- Resource browsing with advanced filters
- Search functionality
- Star rating and review system
- Bookmark and collections system
- Download tracking
- Recommendation engine (collaborative filtering, tag similarity)
- Leaderboard (top contributors, most downloaded, highest rated)
- User dashboard with statistics
- Dark mode and light mode

### Admin Features
- User management (view, change roles, delete)
- Resource moderation (approve/reject uploads)
- Platform analytics dashboard
- Department statistics

### Security Features
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt (12 rounds)
- Rate limiting on API endpoints
- File type validation
- Input validation
- CORS configuration
- Helmet security headers
- XSS protection

## Project Structure

```
college-resource-platform/
├── client/                    # React frontend
│   ├── src/
│   │   ├── api/              # API service layer
│   │   ├── components/       # Reusable UI components
│   │   │   └── ui/           # Base UI components (Button, Card, Input, etc.)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── layouts/          # Layout components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Zustand stores
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utility functions
│   ├── index.html
│   ├── vite.config.ts
│   └── tsconfig.json
├── server/                    # Express backend
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utility functions
│   ├── uploads/              # File upload directory
│   ├── .env                  # Environment variables
│   ├── tsconfig.json
│   └── package.json
└── package.json               # Root package.json (scripts)
```

## Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher, running locally or accessible URI)
- **npm** or **yarn**

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd college-resource-platform
```

### 2. Install all dependencies
```bash
npm run setup
```

Or install manually:
```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 3. Configure Environment Variables

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college-resource-platform
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
NODE_ENV=development
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800
```

### 4. Start MongoDB

Make sure MongoDB is running:
```bash
# On Windows
net start MongoDB

# On macOS (with Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

### 5. Start the Development Server

From the root directory:
```bash
npm run dev
```

This starts both:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

### Or start them separately:
```bash
# Backend only
npm run dev:server

# Frontend only
npm run dev:client
```

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |
| POST | `/api/auth/forgot-password` | Forgot password | No |
| POST | `/api/auth/reset-password` | Reset password | No |

### Resources
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/resources` | Upload resource | Yes |
| GET | `/api/resources` | Get all resources | No |
| GET | `/api/resources/:id` | Get resource detail | Yes |
| PUT | `/api/resources/:id` | Update resource | Yes |
| DELETE | `/api/resources/:id` | Delete resource | Yes |
| GET | `/api/resources/:id/download` | Download file | Yes |
| POST | `/api/resources/:id/reviews` | Add review | Yes |
| GET | `/api/resources/:id/similar` | Get similar resources | Yes |
| GET | `/api/resources/my-resources` | Get my resources | Yes |
| GET | `/api/resources/recommendations` | Get recommendations | Yes |
| GET | `/api/resources/trending` | Get trending | Yes |
| GET | `/api/resources/dashboard/stats` | Dashboard stats | Yes |
| PUT | `/api/resources/:id/approve` | Approve resource | Admin/Mod |
| GET | `/api/resources/pending` | Pending resources | Admin/Mod |
| GET | `/api/resources/admin/stats` | Admin statistics | Admin |

### Bookmarks
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/bookmarks` | Get bookmarks | Yes |
| POST | `/api/bookmarks` | Add bookmark | Yes |
| DELETE | `/api/bookmarks/:resourceId` | Remove bookmark | Yes |
| GET | `/api/bookmarks/leaderboard` | Get leaderboard | Yes |

## Database Schema

### User
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, hashed, select: false)
- `avatar` (String)
- `department` (String, required)
- `semester` (Number, 1-8)
- `role` (String: student/moderator/admin)
- `interests` ([String])
- `uploadCount` (Number)
- `downloadCount` (Number)

### Resource
- `title` (String, required)
- `description` (String, required)
- `fileUrl` (String)
- `fileName` (String)
- `fileSize` (Number)
- `fileType` (String)
- `department` (String)
- `semester` (Number)
- `subject` (String)
- `resourceType` (String enum)
- `tags` ([String])
- `author` (String)
- `uploadedBy` (ObjectId -> User)
- `downloads` (Number)
- `views` (Number)
- `averageRating` (Number)
- `totalRatings` (Number)
- `isApproved` (Boolean)
- `isActive` (Boolean)

### Review
- `resource` (ObjectId -> Resource)
- `user` (ObjectId -> User)
- `rating` (Number, 1-5)
- `comment` (String)

### Bookmark
- `user` (ObjectId -> User)
- `resource` (ObjectId -> Resource)
- `collection` (String)

### Download
- `user` (ObjectId -> User)
- `resource` (ObjectId -> Resource)
- `downloadedAt` (Date)

## Recommendation Engine

The recommendation system uses:

1. **Collaborative Filtering**: Analyzes user download history to find similar resources
2. **Tag-based Recommendations**: Finds resources with overlapping tags
3. **Subject-based Recommendations**: Recommends resources from similar subjects
4. **Department-based**: Prioritizes resources from the user's department
5. **Trending Score**: Combines downloads, views, and ratings for trending resources
6. **Popularity Fallback**: Falls back to most popular resources

## Production Deployment

### Build for Production
```bash
# Build client
cd client
npm run build

# Build server
cd ../server
npm run build
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/college-resource-platform
JWT_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>
```

### Run in Production
```bash
cd server
npm start
```

The Express server serves the built React app from `client/dist/`.

## License

MIT
