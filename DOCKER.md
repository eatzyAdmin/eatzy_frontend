# Docker Build and Run Guide

## Build Commands

### Build a specific app
```bash
# Customer app
docker build --build-arg APP_NAME=customer -t eatzy-customer .

# Admin app
docker build --build-arg APP_NAME=admin -t eatzy-admin .

# Driver app
docker build --build-arg APP_NAME=driver -t eatzy-driver .

# Restaurant app
docker build --build-arg APP_NAME=restaurant -t eatzy-restaurant .

# Super Admin app
docker build --build-arg APP_NAME=super-admin -t eatzy-super-admin .
```

### Build all apps at once
```bash
docker-compose build
```

## Run Commands

### Run a specific app
```bash
# Customer app on port 3000
docker run -p 3000:3000 eatzy-customer

# Admin app on port 3001
docker run -p 3001:3000 eatzy-admin

# Driver app on port 3002
docker run -p 3002:3000 eatzy-driver

# Restaurant app on port 3003
docker run -p 3003:3000 eatzy-restaurant

# Super Admin app on port 3004
docker run -p 3004:3000 eatzy-super-admin
```

### Run all apps with docker-compose
```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop all services
docker-compose down
```

## Port Mapping

- Customer: http://localhost:3000
- Admin: http://localhost:3001
- Driver: http://localhost:3002
- Restaurant: http://localhost:3003
- Super Admin: http://localhost:3004

## Environment Variables

To pass environment variables, create a `.env` file or use:

```bash
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://api.example.com eatzy-customer
```

Or use docker-compose with an env file:

```yaml
environment:
  - NEXT_PUBLIC_API_URL=https://api.example.com
  # Add other env vars as needed
```

## Production Deployment

For production, consider:

1. Setting up proper environment variables
2. Using secrets management for sensitive data
3. Configuring health checks
4. Setting up logging and monitoring
5. Using orchestration tools like Kubernetes for scaling
