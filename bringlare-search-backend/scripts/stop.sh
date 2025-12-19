#!/bin/bash

echo "Stopping Bringlare Search Backend System..."

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "Docker is not installed."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null
then
    echo "Docker Compose is not installed."
    exit 1
fi

# Stop services
echo "Stopping services with Docker Compose..."
docker-compose down

echo "Services stopped successfully!"