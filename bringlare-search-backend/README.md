# Bringlare Search Backend

This is the backend API for the Bringlare Search Engine, built with Node.js and Express. It acts as an intermediary between the frontend and SearXNG search aggregator.

## Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────┐    ┌─────────────────────────────┐
│   Frontend  │◄──►│  Backend API │◄──►│ SearXNG │◄──►│ Search Engines (Google,     │
│  (Next.js)  │    │  (Node.js)   │    │         │    │ Bing, DuckDuckGo, etc.)     │
└─────────────┘    └──────────────┘    └─────────┘    └─────────────────────────────┘
```

The backend API serves as a privacy-focused proxy that:
1. Receives search requests from the frontend
2. Routes them through SearXNG (which aggregates results from multiple engines)
3. Returns cleaned, standardized results to the frontend
4. Implements rate limiting and security measures

## Features

- Aggregates search results from multiple engines via SearXNG
- Rate limiting for abuse prevention
- CORS protection (only allows frontend origin)
- JSON response format
- Health check endpoint
- Dockerized deployment

## Folder Structure

```
bringlare-search-backend/
├── searxng-config/
│   └── settings.yml          # SearXNG configuration
├── scripts/
│   ├── start.sh              # Start all services
│   └── stop.sh               # Stop all services
├── Dockerfile                # Backend Docker image
├── Dockerfile.searxng        # SearXNG Docker image (for Render)
├── docker-compose.yml        # Multi-container setup
├── render.yaml               # Render deployment config
├── server.js                 # Main application
├── healthcheck.js            # Docker health check
├── test-search.js            # API test script
├── package.json              # Dependencies
├── .env                      # Environment variables
└── README.md                 # This file
```

## Setup Instructions

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)

### Running with Docker (Recommended)

1. Clone the repository
2. Navigate to the `bringlare-search-backend` directory
3. Run the services:
   ```bash
   # Using docker-compose directly
   docker-compose up -d
   
   # Or using the provided scripts
   ./scripts/start.sh
   ```

4. Stop the services:
   ```bash
   # Using docker-compose directly
   docker-compose down
   
   # Or using the provided script
   ./scripts/stop.sh
   ```

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Test the search API:
   ```bash
   npm run test:search
   ```

## API Endpoints

### Test Script

Run the test script to verify the API is working:
```bash
npm run test:search
```

### Search Endpoint
```
GET /api/search?q=query&page=1&lang=en
```

**Parameters:**
- `q` (required): Search query
- `page` (optional): Page number (default: 1)
- `lang` (optional): Language (default: en)

**Response:**
```json
{
  "query": "elon musk",
  "results": [
    {
      "title": "Elon Musk - Wikipedia",
      "url": "https://en.wikipedia.org/wiki/Elon_Musk",
      "snippet": "Elon Reeve Musk FRS is a businessman and investor...",
      "engine": "wikipedia"
    }
  ],
  "total": 25
}
```

### Health Check
```
GET /health
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3001 |
| SEARXNG_BASE_URL | SearXNG service URL | http://searxng:8080 |
| ALLOWED_ORIGIN | CORS allowed origin | http://localhost:3000 |
| RATE_LIMIT_POINTS | Requests per window | 30 |
| RATE_LIMIT_DURATION | Window duration (seconds) | 60 |

## Docker Deployment

### Build Images

```bash
# Build backend API
docker build -t bringlare-backend-api .

# Pull SearXNG
docker pull searxng/searxng:latest
```

### Run Containers

```bash
# Using docker-compose (recommended)
docker-compose up -d

# Or run individually
docker run -d --name searxng -p 8080:8080 searxng/searxng:latest
docker run -d --name bringlare-backend -p 3001:3001 bringlare-backend-api
```

## SearXNG Configuration

The `searxng-config/settings.yml` file configures:

- Enabled search engines (Google, Bing, DuckDuckGo, Brave, Qwant)
- Security settings
- Rate limiting
- Result formatting

## Security Features

- Rate limiting (30 requests per minute per IP)
- CORS protection (only allows configured origin)
- HTTP headers security (Helmet.js)
- No direct access to search engines
- All requests proxied through SearXNG

## Future Scaling Tips

1. **Load Balancing**: Use NGINX or cloud load balancer for multiple backend instances
2. **Caching**: Implement Redis caching for frequent queries
3. **Database**: Add PostgreSQL for storing user preferences/search history
4. **Monitoring**: Integrate Prometheus/Grafana for metrics
5. **Logging**: Use ELK stack for centralized logging
6. **CDN**: Serve static assets through CDN
7. **Auto-scaling**: Configure Kubernetes for automatic scaling

## Troubleshooting

### Common Issues

1. **SearXNG not starting**: Check configuration file syntax
2. **CORS errors**: Verify ALLOWED_ORIGIN matches frontend URL
3. **Rate limiting**: Implement exponential backoff in frontend
4. **Timeout errors**: Increase timeout values in server.js

### Logs

```bash
# View container logs
docker-compose logs searxng
docker-compose logs backend-api
```