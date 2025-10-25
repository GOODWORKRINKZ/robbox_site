# Docker Deployment Guide

This guide explains how to deploy the ROBBOX website using Docker.

## Quick Start

### Using Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/GOODWORKRINKZ/robbox_site.git
cd robbox_site
```

2. Build and run with Docker Compose:
```bash
docker-compose up -d
```

The site will be available at `http://localhost`

### Using Docker CLI

1. Build the Docker image:
```bash
docker build -t robbox-site .
```

2. Run the container:
```bash
docker run -d -p 80:80 --name robbox-site robbox-site
```

## Deployment to VPS

### Prerequisites

- VPS with Docker and Docker Compose installed
- SSH access to your VPS
- Domain name (optional)

### Option 1: Using GitHub Container Registry

The Docker image is automatically built and pushed to GitHub Container Registry on every push to main branch.

1. SSH into your VPS:
```bash
ssh user@your-vps-ip
```

2. Pull the latest image:
```bash
docker pull ghcr.io/goodworkrinkz/robbox_site:latest
```

3. Run the container:
```bash
docker run -d -p 80:80 --name robbox-site --restart unless-stopped ghcr.io/goodworkrinkz/robbox_site:latest
```

### Option 2: Build on VPS

1. SSH into your VPS and clone the repository:
```bash
ssh user@your-vps-ip
git clone https://github.com/GOODWORKRINKZ/robbox_site.git
cd robbox_site
```

2. Build and run with Docker Compose:
```bash
docker-compose up -d
```

### Updating the Deployment

To update to the latest version:

**Using pre-built image:**
```bash
docker pull ghcr.io/goodworkrinkz/robbox_site:latest
docker stop robbox-site
docker rm robbox-site
docker run -d -p 80:80 --name robbox-site --restart unless-stopped ghcr.io/goodworkrinkz/robbox_site:latest
```

**Using Docker Compose:**
```bash
cd robbox_site
git pull
docker-compose up -d --build
```

## Configuration

### Port Configuration

To run on a different port (e.g., 8080):

**Docker CLI:**
```bash
docker run -d -p 8080:80 --name robbox-site robbox-site
```

**Docker Compose:**
Edit `docker-compose.yml` and change the ports mapping:
```yaml
ports:
  - "8080:80"
```

### Using with Reverse Proxy (Nginx/Traefik)

If you're using a reverse proxy, you can run the container without exposing port 80:

```yaml
services:
  robbox-site:
    build: .
    container_name: robbox-site
    restart: unless-stopped
    networks:
      - proxy-network
```

## Monitoring

### View logs:
```bash
docker logs robbox-site
```

### View real-time logs:
```bash
docker logs -f robbox-site
```

### Check container status:
```bash
docker ps | grep robbox-site
```

## Troubleshooting

### Container won't start
```bash
docker logs robbox-site
```

### Rebuild image without cache:
```bash
docker build --no-cache -t robbox-site .
```

### Remove old containers and images:
```bash
docker stop robbox-site
docker rm robbox-site
docker rmi robbox-site
```

## Security Considerations

1. **HTTPS:** Use a reverse proxy (Nginx, Traefik, Caddy) with Let's Encrypt for HTTPS
2. **Firewall:** Configure your VPS firewall to only allow necessary ports
3. **Updates:** Regularly update the Docker image to get latest security patches

## Performance

The Docker image is optimized for production:
- Multi-stage build for minimal image size (< 50MB)
- Nginx with gzip compression enabled
- Static asset caching configured
- Based on Alpine Linux for security and size

## CI/CD

The GitHub Actions workflow automatically:
- Builds the Docker image on every push to main
- Pushes the image to GitHub Container Registry
- Tags images with branch name, commit SHA, and 'latest'

To use the automated builds, simply push to the main branch and the image will be available at:
```
ghcr.io/goodworkrinkz/robbox_site:latest
```
