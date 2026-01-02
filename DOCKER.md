# 🐳 Docker Documentation

This document provides comprehensive information about running the Todo List application using Docker.

## 📋 Table of Contents

1. [Why Docker?](#why-docker)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Docker Commands Reference](#docker-commands-reference)
5. [Dockerfile Explanation](#dockerfile-explanation)
6. [Troubleshooting](#troubleshooting)

## 🎯 Why Docker?

Docker provides several advantages for this application:

- **Consistency**: Works the same on any system (Windows, Mac, Linux)
- **No Dependencies**: No need to install Node.js, npm, or any dependencies
- **Production-Ready**: Uses nginx for optimal performance
- **Isolation**: Doesn't interfere with other applications on your system
- **Easy Deployment**: Single command to run the entire application

## 📦 Prerequisites

### Install Docker

#### Windows & Mac:
Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

#### Linux:
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (to run without sudo)
sudo usermod -aG docker $USER
# Log out and log back in for this to take effect
```

### Verify Installation

```bash
docker --version
docker-compose --version
```

## 🚀 Quick Start

### Method 1: Using Docker Compose (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/ozalp44/-zalp-zel22051350172vibe-coding-todo.git
cd -zalp-zel22051350172vibe-coding-todo

# 2. Build and start the container
docker-compose up -d

# 3. Open browser
# Navigate to http://localhost:3000
```

### Method 2: Using Docker Commands

```bash
# 1. Clone the repository
git clone https://github.com/ozalp44/-zalp-zel22051350172vibe-coding-todo.git
cd -zalp-zel22051350172vibe-coding-todo

# 2. Build the image
docker build -t vibe-coding-todo:latest .

# 3. Run the container
docker run -d -p 3000:80 --name todo-app vibe-coding-todo:latest

# 4. Open browser
# Navigate to http://localhost:3000
```

## 📚 Docker Commands Reference

### Building

```bash
# Build the image
docker build -t vibe-coding-todo:latest .

# Build with no cache (fresh build)
docker build --no-cache -t vibe-coding-todo:latest .

# Build and tag with version
docker build -t vibe-coding-todo:1.0.0 .
```

### Running

```bash
# Run in detached mode (background)
docker run -d -p 3000:80 --name todo-app vibe-coding-todo:latest

# Run in interactive mode (see logs in real-time)
docker run -it -p 3000:80 --name todo-app vibe-coding-todo:latest

# Run with custom port (e.g., 8080)
docker run -d -p 8080:80 --name todo-app vibe-coding-todo:latest

# Run with automatic restart
docker run -d -p 3000:80 --restart unless-stopped --name todo-app vibe-coding-todo:latest
```

### Managing Containers

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# View container logs
docker logs todo-app

# Follow logs in real-time
docker logs -f todo-app

# Stop container
docker stop todo-app

# Start stopped container
docker start todo-app

# Restart container
docker restart todo-app

# Remove container
docker rm todo-app

# Remove container forcefully (if running)
docker rm -f todo-app
```

### Managing Images

```bash
# List all images
docker images

# Remove image
docker rmi vibe-coding-todo:latest

# Remove all unused images
docker image prune

# Remove all unused images, containers, networks
docker system prune -a
```

### Docker Compose Commands

```bash
# Start services (build if needed)
docker-compose up

# Start in detached mode
docker-compose up -d

# Rebuild and start
docker-compose up --build

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Restart services
docker-compose restart
```

### Inspection

```bash
# Inspect container details
docker inspect todo-app

# View container resource usage
docker stats todo-app

# Execute command in running container
docker exec -it todo-app sh

# Access nginx logs inside container
docker exec todo-app cat /var/log/nginx/access.log
```

## 🔍 Dockerfile Explanation

Our Dockerfile uses a **multi-stage build** approach for optimization:

### Stage 1: Builder (Node.js)
```dockerfile
FROM node:18-alpine AS builder
```
- Uses lightweight Alpine Linux with Node.js 18
- Installs dependencies and builds the React application
- Creates optimized production build

### Stage 2: Production (Nginx)
```dockerfile
FROM nginx:alpine
```
- Uses lightweight nginx on Alpine Linux
- Copies only the built files (no source code or dependencies)
- Results in a much smaller final image (~25MB vs ~300MB)

### Key Benefits:
- **Small Image Size**: Only includes necessary runtime files
- **Security**: No development dependencies in production
- **Performance**: Nginx serves static files very efficiently
- **Fast Startup**: Minimal container overhead

## 🐛 Troubleshooting

### Port Already in Use

**Error**: `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solution**:
```bash
# Option 1: Use a different port
docker run -d -p 8080:80 --name todo-app vibe-coding-todo:latest

# Option 2: Stop the process using port 3000
# On Linux/Mac:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Container Immediately Exits

**Check logs**:
```bash
docker logs todo-app
```

**Common causes**:
- Build failed: Rebuild with `docker build --no-cache`
- Nginx configuration issue: Check Dockerfile

### Cannot Connect to http://localhost:3000

**Checks**:
```bash
# Verify container is running
docker ps

# Check port mapping
docker port todo-app

# Test with curl
curl http://localhost:3000
```

### Build Fails

**Solutions**:
```bash
# Clean build with no cache
docker build --no-cache -t vibe-coding-todo:latest .

# Check if you have enough disk space
docker system df

# Clean up unused resources
docker system prune -a
```

### Permission Denied (Linux)

**Solution**:
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Log out and log back in, or use:
newgrp docker
```

### Out of Memory

**Solution**:
```bash
# Increase Docker memory limit in Docker Desktop settings
# Or add to docker-compose.yml:
services:
  todo-app:
    deploy:
      resources:
        limits:
          memory: 512M
```

## 📊 Image Size Optimization

Our multi-stage build achieves significant size reduction:

| Stage | Image Size | Contents |
|-------|-----------|----------|
| Builder | ~350MB | Node.js + dependencies + source code |
| Production | ~25MB | Only nginx + built files |

**Savings**: ~93% reduction in final image size!

## 🌐 Deployment to Cloud

### Push to Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag image
docker tag vibe-coding-todo:latest yourusername/vibe-coding-todo:latest

# Push image
docker push yourusername/vibe-coding-todo:latest
```

### Run from Docker Hub

```bash
docker run -d -p 3000:80 --name todo-app yourusername/vibe-coding-todo:latest
```

## 📝 Best Practices

1. **Always use specific versions**: Instead of `node:18-alpine`, use `node:18.19.0-alpine`
2. **Keep images small**: Use Alpine-based images
3. **Use .dockerignore**: Exclude unnecessary files from build context
4. **Multi-stage builds**: Separate build and runtime environments
5. **Health checks**: Add health checks for production deployments
6. **Security**: Regularly update base images

## 🎓 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)

---

**Created for**: Docker Homework Assignment  
**Student**: Özalp Özel (22051350172)  
**Date**: January 2026
