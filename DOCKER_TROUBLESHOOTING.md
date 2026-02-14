# Docker Build Troubleshooting Guide

## Recent Fixes Applied

### 1. **Dependencies Installation** ✅
**Issue**: Build was excluding devDependencies needed for TypeScript and Next.js compilation.

**Fix**: Changed Dockerfile line 16-17:
```dockerfile
# Before (BROKEN):
RUN npm ci --only=production --ignore-scripts

# After (FIXED):
RUN npm ci --ignore-scripts
```

### 2. **Package Lock Exclusion** ✅
**Issue**: `.dockerignore` was excluding `package-lock.json`, preventing reproducible builds.

**Fix**: Removed line from `.dockerignore`:
```
# package-lock.json - KEEP THIS for reproducible builds with npm ci
```

### 3. **Memory Allocation** ✅
**Issue**: Build was limited to 1GB which wasn't enough for 50+ tools.

**Fix**: Increased memory in Dockerfile line 34:
```dockerfile
# Before:
ENV NODE_OPTIONS="--max-old-space-size=1024"

# After:
ENV NODE_OPTIONS="--max-old-space-size=2048"
```

### 4. **Missing Public Folder** ✅
**Issue**: Dockerfile tried to copy `/app/public` which didn't exist.

**Fix**: Created `public/` folder with README.txt

## Verification Steps

### Local Build Verification
```bash
# Clean build
rm -rf .next node_modules
npm install
npm run build

# Verify standalone output
ls -la .next/standalone/
# Should see: .next/, node_modules/, package.json, server.js
```

### Docker Build Test (if available locally)
```bash
# Clear Docker cache
docker builder prune -a -f

# Build with detailed logs
docker build --progress=plain --no-cache -t codelithlabs-web:test . 2>&1 | tee build.log

# Check for errors
grep -i "error" build.log
```

## Common Docker Build Errors

### Error: "npm ERR! network"
**Cause**: Network connectivity issues during `npm install`
**Solution**:
- Check Portainer host network connectivity
- Try adding `--network host` to docker build
- Verify DNS settings in Docker daemon

### Error: "ENOSPC: no space left on device"
**Cause**: Docker host disk full
**Solution**:
```bash
# Clean up Docker
docker system prune -a -f
docker volume prune -f
```

### Error: "JavaScript heap out of memory"
**Cause**: Not enough memory allocated
**Solution**: Already fixed (2GB allocation), but if still happening:
- Increase `NODE_OPTIONS` to `--max-old-space-size=3072` (3GB)
- Allocate more memory to Docker daemon in Portainer/Docker settings

### Error: "Error: spawn ENOMEM"
**Cause**: System resource exhaustion
**Solution**:
- Stop other containers temporarily
- Increase Docker daemon memory limits
- Build during low-traffic periods

## Portainer-Specific Notes

### Rebuilding the Stack
1. Go to Portainer → Stacks → codelithlabs-web
2. Click "Stop Stack"
3. Click "Editor" tab
4. Make sure you're using the latest docker-compose.yml
5. Enable "Re-pull image and redeploy"
6. Click "Update Stack"

### Viewing Build Logs in Portainer
1. Stacks → codelithlabs-web → Containers
2. Click on the building container
3. View "Logs" tab
4. Look for error messages near the bottom

### Memory Allocation in Portainer
If build keeps failing with memory errors:
1. Go to Stacks → codelithlabs-web → Editor
2. Add memory limits to docker-compose.yml:
```yaml
services:
  app:
    build:
      context: .
      args:
        NODE_OPTIONS: "--max-old-space-size=3072"
    deploy:
      resources:
        limits:
          memory: 4G
        reservations:
          memory: 2G
```

## Current Stack Status

| Component | Status | Notes |
|-----------|--------|-------|
| Local Build | ✅ Working | 64 pages, 50 tools, middleware active |
| Standalone Output | ✅ Generated | .next/standalone/ exists with server.js |
| Dependencies | ✅ Fixed | All deps (including dev) installed |
| Package Lock | ✅ Fixed | Included in Docker context |
| Memory | ✅ Fixed | 2GB allocated for build |
| Public Folder | ✅ Fixed | Created with README.txt |

## Next Steps

1. **Rebuild in Portainer**: Follow "Rebuilding the Stack" steps above
2. **Monitor Logs**: Watch build logs for any new errors
3. **Check Resources**: Ensure Docker host has:
   - At least 4GB free RAM
   - At least 10GB free disk space
   - Good network connectivity

## Expected Build Output

Successful build should show:
```
✓ Compiled successfully in ~10-30s
✓ Generating static pages (64/64)
✓ Finalizing page optimization
---
Route (app)
├ ○ / (50 routes)
└ ƒ Proxy (Middleware)
```

## Contact

If build still fails after these fixes, check:
1. Portainer logs for specific error messages
2. Docker daemon logs on the host
3. System resources (RAM, disk, network)
4. Firewall rules blocking npm registry access
