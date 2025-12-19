#!/bin/bash

echo "Starting Bringlare Search Backend System..."

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null
then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Start services
echo "Starting services with Docker Compose..."
docker-compose up -d

# Wait for services to start
echo "Waiting for services to initialize..."
sleep 10

# Check if services are running
echo "Checking service status..."
if docker-compose ps | grep -q "running"; then
    echo "Services started successfully!"
    echo "Backend API: http://localhost:3001"
    echo "SearXNG: http://localhost:8080"
else
    echo "There was an issue starting the services. Check the logs:"
    docker-compose logs
fi