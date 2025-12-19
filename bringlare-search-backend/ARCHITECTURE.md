# Bringlare Search Engine - Complete Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Bringlare Ecosystem                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌──────────────────┐    ┌──────────────────────┐   │
│  │  Frontend App   │◄──►│  Backend API     │◄──►│     SearXNG          │   │
│  │  (Next.js)      │    │  (Node.js)       │    │  (Meta Search)       │   │
│  └─────────────────┘    └──────────────────┘    └──────────────────────┘   │
│            ▲                                       ▲          ▲            │
│            │                                       │          │            │
│            ▼                                       ▼          ▼            │
│  ┌─────────────────┐                   ┌──────────────┐┌────────────────┐  │
│  │   User Browser  │                   │ Search       ││ Search         │  │
│  │                 │                   │ Engines      ││ Engines        │  │
│  └─────────────────┘                   │ (Google,     ││ (Bing,         │  │
│                                        │  DDG, etc.)  ││  Brave, etc.)  │  │
│                                        └──────────────┘└────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Detailed Component Breakdown

### 1. Frontend Application (bringlare-search-master)
- Built with Next.js 16
- Responsive search interface
- Dark/light mode support
- Search suggestions and trending topics
- Animations with Framer Motion
- UI components with shadcn/ui

### 2. Backend API (bringlare-search-backend)
- Node.js Express server
- Acts as privacy-focused proxy
- Rate limiting and security measures
- Standardized JSON response format
- Dockerized for easy deployment

### 3. SearXNG Service
- Open-source metasearch engine
- Aggregates results from multiple sources
- Privacy-focused (no tracking)
- Configurable engines and settings
- Docker container deployment

### 4. Search Engines
- Google (via SearXNG)
- Bing (via SearXNG)
- DuckDuckGo (via SearXNG)
- Brave (via SearXNG)
- Qwant (via SearXNG)

## Data Flow

```
1. User enters search query in frontend
         │
         ▼
2. Frontend sends request to Backend API
         │
         ▼
3. Backend API validates and forwards to SearXNG
         │
         ▼
4. SearXNG queries multiple search engines
         │
         ▼
5. SearXNG aggregates and processes results
         │
         ▼
6. Backend API receives results and formats them
         │
         ▼
7. Frontend displays clean, standardized results
```

## Security & Privacy Features

### User Privacy Protection
- No personal data collected
- No search history stored
- No tracking or profiling
- All requests anonymized through SearXNG

### System Security
- Rate limiting prevents abuse
- CORS protection restricts origins
- Input validation and sanitization
- Container isolation with Docker
- Secure HTTP headers with Helmet.js

## Deployment Architecture

```
Production Deployment (Render):

┌─────────────────────────────────────────────────────────────┐
│                      Render Platform                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐     ┌─────────────────┐               │
│  │ Web Service     │     │ Web Service     │               │
│  │ (Frontend)      │     │ (Backend API)   │               │
│  │ Port: 10000     │◄───►│ Port: 10000     │               │
│  └─────────────────┘     └─────────────────┘               │
│                                    │                        │
│                                    ▼                        │
│                          ┌─────────────────┐               │
│                          │ Docker Service  │               │
│                          │ (SearXNG)       │               │
│                          │ Port: 8080      │               │
│                          └─────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

## Scalability Considerations

### Horizontal Scaling
- Multiple backend API instances behind load balancer
- Multiple SearXNG instances for redundancy
- CDN for static assets
- Database clustering for user data (future)

### Performance Optimization
- Redis caching for frequent queries
- Connection pooling for SearXNG requests
- Response compression
- Efficient result processing

### Monitoring & Maintenance
- Health checks for all services
- Logging and log aggregation
- Performance metrics collection
- Automated alerts for issues

This architecture ensures a privacy-first, scalable search experience that aggregates results from multiple engines while protecting user data.