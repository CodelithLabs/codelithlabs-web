#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# CodelithLabs Tools Platform - Deployment Script
# Target: Ubuntu Server 22.04/24.04 (Ryzen 3 3200G, 8GB RAM, 120GB SSD)
# 
# USAGE: 
#   chmod +x deploy.sh
#   sudo ./deploy.sh
# ═══════════════════════════════════════════════════════════════════════════════

set -e  # Exit on any error

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════
APP_NAME="codelithlabs"
APP_DIR="/opt/$APP_NAME"
REPO_URL="https://github.com/codelithlabs/codelithlabs.github.io.git"  # Update this
BRANCH="main"
DOMAIN="codelithlabs.in"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ═══════════════════════════════════════════════════════════════════════════════
# PRE-FLIGHT CHECKS
# ═══════════════════════════════════════════════════════════════════════════════
log_info "Running pre-flight checks..."

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    log_error "Please run with sudo: sudo ./deploy.sh"
    exit 1
fi

# Check Ubuntu version
if ! grep -q "Ubuntu" /etc/os-release; then
    log_warn "This script is optimized for Ubuntu. Proceed with caution."
fi

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 1: System Dependencies
# ═══════════════════════════════════════════════════════════════════════════════
log_info "Step 1/7: Installing system dependencies..."

apt-get update -qq
apt-get install -y -qq \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    ufw \
    fail2ban

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 2: Install Docker (if not present)
# ═══════════════════════════════════════════════════════════════════════════════
log_info "Step 2/7: Setting up Docker..."

if ! command -v docker &> /dev/null; then
    log_info "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    
    # Add current user to docker group
    usermod -aG docker $SUDO_USER 2>/dev/null || true
    
    # Enable and start Docker
    systemctl enable docker
    systemctl start docker
else
    log_info "Docker already installed: $(docker --version)"
fi

# Install Docker Compose plugin if not present
if ! docker compose version &> /dev/null; then
    log_info "Installing Docker Compose plugin..."
    apt-get install -y -qq docker-compose-plugin
fi

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 3: Configure System for Low Memory
# ═══════════════════════════════════════════════════════════════════════════════
log_info "Step 3/7: Optimizing system for 8GB RAM..."

# Set swappiness low (prefer RAM over swap)
echo "vm.swappiness=10" > /etc/sysctl.d/99-swappiness.conf
sysctl -p /etc/sysctl.d/99-swappiness.conf

# Create swap if not exists (2GB for safety)
if ! swapon --show | grep -q "/swapfile"; then
    log_info "Creating 2GB swap file..."
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 4: Clone/Update Repository
# ═══════════════════════════════════════════════════════════════════════════════
log_info "Step 4/7: Setting up application directory..."

# Create Docker network if not exists
docker network create codelith-core-services_internal_net 2>/dev/null || true

if [ -d "$APP_DIR" ]; then
    log_info "Updating existing installation..."
    cd "$APP_DIR"
    git fetch origin
    git reset --hard origin/$BRANCH
else
    log_info "Cloning repository..."
    git clone --depth 1 --branch $BRANCH $REPO_URL $APP_DIR
    cd "$APP_DIR"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 5: Setup Nginx Config
# ═══════════════════════════════════════════════════════════════════════════════
log_info "Step 5/7: Configuring Nginx..."

mkdir -p $APP_DIR/nginx/ssl

cat > $APP_DIR/nginx/nginx.conf << 'NGINX_CONF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    # Cache settings
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:10m inactive=24h max_size=1g;
    
    upstream nextjs {
        server website:3000;
        keepalive 64;
    }
    
    server {
        listen 80;
        server_name _;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        
        # Static files caching
        location /_next/static {
            proxy_cache STATIC;
            proxy_pass http://nextjs;
            proxy_cache_valid 200 365d;
            add_header Cache-Control "public, max-age=31536000, immutable";
        }
        
        location /static {
            proxy_cache STATIC;
            proxy_pass http://nextjs;
            proxy_cache_valid 200 365d;
            add_header Cache-Control "public, max-age=31536000, immutable";
        }
        
        # API rate limiting
        location /api {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://nextjs;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
        
        # All other requests
        location / {
            proxy_pass http://nextjs;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
NGINX_CONF

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 6: Build and Deploy
# ═══════════════════════════════════════════════════════════════════════════════
log_info "Step 6/7: Building and deploying containers..."

cd $APP_DIR

# Stop existing containers
docker compose down --remove-orphans 2>/dev/null || true

# Build with memory limits
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Build the app (limit concurrent builds)
docker compose build --no-cache --parallel 1

# Start services
docker compose up -d

# Wait for health check
log_info "Waiting for application to start..."
sleep 10

# Check if running
if docker compose ps | grep -q "Up"; then
    log_info "Application is running!"
else
    log_error "Application failed to start. Checking logs..."
    docker compose logs --tail=50
    exit 1
fi

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 7: Firewall Configuration
# ═══════════════════════════════════════════════════════════════════════════════
log_info "Step 7/7: Configuring firewall..."

ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp

# ═══════════════════════════════════════════════════════════════════════════════
# POST-DEPLOYMENT
# ═══════════════════════════════════════════════════════════════════════════════

echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ DEPLOYMENT COMPLETE!${NC}"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""
echo "📊 Resource Usage:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
echo ""
echo "🔗 Access your site:"
echo "   Local:  http://localhost"
echo "   Public: http://$DOMAIN (configure DNS)"
echo ""
echo "📋 Useful commands:"
echo "   View logs:     docker compose -f $APP_DIR/docker-compose.yml logs -f"
echo "   Restart:       docker compose -f $APP_DIR/docker-compose.yml restart"
echo "   Stop:          docker compose -f $APP_DIR/docker-compose.yml down"
echo "   Update:        cd $APP_DIR && git pull && docker compose up -d --build"
echo ""
echo "⚠️  Next steps:"
echo "   1. Point your domain DNS to this server's IP"
echo "   2. Run: certbot --nginx -d $DOMAIN (for SSL)"
echo "   3. Update AdSense publisher ID in components"
echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"