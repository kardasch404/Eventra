# Docker Setup Guide

## Overview

This directory contains Docker configuration for the Eventra backend infrastructure.

## Services

### MongoDB (Port 27018)
- Database for application data
- Persistent volume: `mongodb_data`
- Admin credentials configured via environment variables
- **Note:** Using port 27018 to avoid conflicts with local MongoDB

### Redis (Port 6380)
- Caching and session storage
- Persistent volume: `redis_data`
- Password authentication enabled
- **Note:** Using port 6380 to avoid conflicts with local Redis

### Mongo Express (Port 8081)
- Web-based MongoDB admin interface
- Access: http://localhost:8081
- Basic auth protected

## Quick Start

1. **Copy environment file:**
   ```bash
   cp ../.env.example ../.env
   ```

2. **Update credentials in `.env`** (change default passwords!)

3. **Start services:**
   ```bash
   docker-compose up -d
   ```

4. **Check status:**
   ```bash
   docker-compose ps
   ```

5. **View logs:**
   ```bash
   docker-compose logs -f
   ```

6. **Stop services:**
   ```bash
   docker-compose down
   ```

## Backend Container

Build and run the backend:

```bash
# Build image
docker build -f Dockerfile -t eventra-backend ..

# Run container
docker run -p 4000:4000 --env-file ../.env eventra-backend
```

## Network

All services run on the `eventra-network` bridge network, allowing inter-container communication.

## Volumes

- `mongodb_data`: MongoDB data persistence
- `redis_data`: Redis data persistence

## Environment Variables

See `../.env.example` for all required variables.

**Important:** Never commit `.env` file to version control!
