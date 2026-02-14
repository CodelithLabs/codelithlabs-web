# Docker Deployment Guide for CodelithLabs Tools Platform

## Fixed Issues

### 1. Network Configuration
**Problem**: External network `codelith-core-services_internal_net` didn't exist
**Fix**: Changed to internal bridge network that Docker creates automatically

### 2. Missing nginx Configuration
**Problem**: nginx service referenced non-existent configuration files
**Fix**: Commented out nginx service (can be enabled later when you create the config)

### 3. Healthcheck Command
**Problem**: Used `wget` which isn't available in alpine images
**Fix**: Changed to `curl` and installed it in the Dockerfile

## Deploying with Portainer

### Option 1: Using Portainer Stacks (Recommended)

1. Open Portainer dashboard
2. Go to **Stacks** → **Add Stack**
3. Name: `codelithlabs-tools`
4. Build method: **Repository**
   - Repository URL: `https://github.com/yourusername/codelithlabs.github.io`
   - Or choose **Upload** and select `docker-compose.yml`
5. Click **Deploy the stack**

### Option 2: Using Docker Compose CLI

```bash
# Build and start in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f website

# Stop containers
docker-compose down

# Rebuild after code changes
docker-compose up -d --build --force-recreate
```

## Accessing Your Application

- **Application**: http://localhost:3000
- **Portainer**: http://localhost:9000 (if you have Portainer running)

## Container Details

### Main Container: `codelith_tools_platform`
- **Port**: 3000 → 3000
- **Memory Limit**: 1GB
- **CPU Limit**: 2 cores
- **Healthcheck**: Every 30 seconds on http://localhost:3000/

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs codelith_tools_platform

# Check if port 3000 is already in use
netstat -ano | findstr :3000  # Windows
lsof -i :3000                # Linux/Mac
```

### Build fails
```bash
# Clean build cache
docker-compose down
docker system prune -a
docker-compose up -d --build
```

### Portainer can't see containers
1. Make sure Portainer is connected to the correct Docker environment
2. Check that containers are actually running: `docker ps`
3. Verify network exists: `docker network ls`
4. In Portainer, go to **Environments** → Select your environment → **Reconnect**

### Memory issues
If you get OOM (Out of Memory) errors:
1. Lower the memory limits in docker-compose.yml
2. Reduce `NODE_OPTIONS=--max-old-space-size=512` to 256 or 384

## Enabling nginx (Optional)

To enable the nginx reverse proxy:

1. Create directory structure:
```bash
mkdir -p nginx/ssl
```

2. Create `nginx/nginx.conf`:
```nginx
events {
  worker_connections 1024;
}

http {
  upstream nextjs {
    server website:3000;
  }

  server {
    listen 80;
    server_name localhost;

    location / {
      proxy_pass http://nextjs;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
    }
  }
}
```

3. Uncomment the nginx service in docker-compose.yml

4. Rebuild: `docker-compose up -d --build`

## Production Deployment

For production servers:

1. Set up SSL certificates in `nginx/ssl/`
2. Update nginx config to use HTTPS (port 443)
3. Set proper domain name in nginx config
4. Consider enabling Redis for caching (uncomment in docker-compose.yml)
5. Set up proper environment variables for production
6. Configure firewall to allow ports 80/443
7. Set up automated backups
8. Enable Docker restart policies (already configured as `unless-stopped`)

## Resource Usage

Current configuration for 8GB RAM server:
- Next.js App: 1GB max (256MB guaranteed)
- nginx: 128MB max (when enabled)
- Redis: 150MB max (when enabled)
- System: ~1GB
- **Available**: ~5.5GB for builds and safety buffer

## Monitoring

### View container stats
```bash
docker stats codelith_tools_platform
```

### Check health status
```bash
docker inspect --format='{{.State.Health.Status}}' codelith_tools_platform
```

### Access container shell
```bash
docker exec -it codelith_tools_platform sh
```
