# Daily Declarations Frontend

Frontend for the Daily Declarations website - a daily affirmations blog for sisters.

## Tech Stack
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React (icons)

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

**Development:**
- `VITE_API_URL` - Backend API URL (default: http://localhost:3001)

**Production:**
- `VITE_API_URL` - Backend API URL (e.g., https://daily-declarations-backend.onrender.com)

## Deployment

Deploy as a static site on Render:
1. Push code to GitHub
2. Create new web service on Render
3. Runtime: Static
4. Build Command: `npm run build`
5. Publish Directory: `dist`
6. Add `VITE_API_URL` environment variable

## Features

- ✅ Daily affirmations display
- ✅ Individual affirmation pages
- ✅ Category filtering
- ✅ Search functionality
- ✅ Email subscription
- ✅ CMS for managing affirmations
- ✅ Share functionality
- ✅ Responsive design
