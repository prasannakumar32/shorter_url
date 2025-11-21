# 🔗 Shorter URL - Professional URL Shortener

A production-ready URL shortener application similar to bit.ly, built with a professional separation of concerns using Node.js + Express.js backend and React frontend.

## ✨ Features

### Core Functionality
- **🔗 Create Short Links**: Generate short URLs from long URLs with optional custom codes
- **⚡ Fast Redirects**: HTTP 302 redirects to original URLs with click tracking
- **📊 Analytics**: Track total clicks, last clicked time, and performance metrics
- **🔍 Search & Filter**: Find URLs by code or target URL
- **🗑️ Link Management**: Create, view, and delete URLs with confirmation

### Advanced Features
- **🏥 Health Monitoring**: Real-time system health checks with database status
- **📱 Responsive Design**: Mobile-first design that works on all devices
- **🔒 Security**: Rate limiting, CORS protection, and input validation
- **⚡ Performance**: Optimized queries, compression, and caching
- **🎨 Professional UI**: Modern, clean interface with smooth animations

## 🏗️ Architecture

```
shorter-url/
├── backend/                 # Express.js API Server
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React TypeScript App
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── tsconfig.json
├── README.md
├── .env.example
└── package.json            # Root package.json for orchestration
```

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - RESTful API server
- **TypeScript** - Type-safe development
- **PostgreSQL** - Production database (Neon recommended)
- **Nanoid** - Secure short code generation
- **Helmet** - Security headers
- **Rate Limiting** - API protection
- **Compression** - Response optimization
- **Morgan** - Request logging

### Frontend
- **React 18** with **TypeScript** - Modern UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Custom Hooks** - Reusable state management
- **Responsive CSS** - Mobile-first design

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16 or higher
- **PostgreSQL** database (Neon recommended for free hosting)
- **npm** v8 or higher

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd shorter-url

# Install all dependencies (backend + frontend)
npm run install-all
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Configure your database URL
# Example for Neon (recommended):
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require

# Frontend environment (optional)
cd frontend
cp .env.example .env
```

### 3. Development

```bash
# Start both backend and frontend in development mode
npm run dev

# Or start separately:
npm run server    # Backend on http://localhost:5000
npm run client    # Frontend on http://localhost:3000
```

### 4. Production Build

```bash
# Build frontend for production
npm run build

# Start production server
npm start
```

## 📡 API Documentation

### URL Management
```http
POST   /api/urls          # Create short URL
GET    /api/urls          # List all URLs (with ?search=filter)
GET    /api/urls/:code    # Get URL statistics
DELETE /api/urls/:code    # Delete URL
```

### Redirect
```http
GET    /:code             # Redirect to original URL
```

### Health Check
```http
GET    /api/health        # System health status
```

### Example Requests

**Create Short URL:**
```bash
curl -X POST http://localhost:5000/api/urls \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/very/long/url"}'
```

**Create with Custom Code:**
```bash
curl -X POST http://localhost:5000/api/urls \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "customCode": "docs"}'
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Backend Deployment:**
   - Connect GitHub repository to Vercel
   - Set environment variables:
     - `DATABASE_URL`: Your Neon PostgreSQL connection
     - `PORT`: 5000
     - `NODE_ENV`: production

2. **Frontend Deployment:**
   - React app builds automatically
   - Update `REACT_APP_API_URL` to point to deployed backend

### Alternative Options

- **Render**: Separate backend/frontend deployments
- **Railway**: Full-stack deployment
- **AWS**: Elastic Beanstalk + RDS
- **DigitalOcean**: App Platform + Managed Database

## 🗄️ Database Schema

```sql
CREATE TABLE urls (
  id SERIAL PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  last_clicked TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_short_code ON urls(short_code);
CREATE INDEX idx_created_at ON urls(created_at);
```

## 🔧 Configuration

### Backend Environment Variables
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://...
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🧪 Development Commands

```bash
# Development
npm run dev              # Start both servers
npm run server           # Backend only
npm run client           # Frontend only

# Building
npm run build            # Build frontend
npm run build-backend    # Build backend (TypeScript)

# Installation
npm run install-all      # Install all dependencies
npm run install-deps     # Install root + all sub-packages

# Production
npm start                # Start production server
```

## 📈 Performance Features

- **Database Indexing**: Optimized queries for lookups
- **Connection Pooling**: Efficient database connections
- **Response Compression**: Reduced bandwidth usage
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Secure data handling
- **Error Handling**: Comprehensive error management

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS Protection**: Cross-origin request control
- **Rate Limiting**: DDoS protection
- **Input Sanitization**: XSS prevention
- **Environment Variables**: Secure configuration
- **SQL Injection Prevention**: Parameterized queries

## 📱 UI Features

- **Responsive Design**: Works on all screen sizes
- **Dark/Light Mode**: Theme support (CSS variables)
- **Smooth Animations**: Micro-interactions
- **Loading States**: User feedback
- **Error Handling**: User-friendly messages
- **Accessibility**: ARIA labels and semantic HTML

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for commercial or personal use!

## 🆘 Support

- 📧 Create an issue for bugs
- 💬 Start a discussion for questions
- 📖 Check the documentation
- 🎯 Follow the contribution guidelines
