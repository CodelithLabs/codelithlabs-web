# ═══════════════════════════════════════════════════════════════════════════════
# 🛠️ CodelithLabs Tools Platform - Setup Instructions
# ═══════════════════════════════════════════════════════════════════════════════

## Quick Start

The following files have been created in your root directory. Move them to their
correct locations as shown below:

```
STEP 1: Create the directory structure
───────────────────────────────────────

mkdir -p src/types
mkdir -p src/lib
mkdir -p src/components/tools/impl
mkdir -p src/app/tools/[slug]

STEP 2: Move files to their correct locations
──────────────────────────────────────────────

# Type definitions
mv TOOLS_PLATFORM_TYPES.ts src/types/tool.ts

# Tools registry
mv TOOLS_PLATFORM_REGISTRY.ts src/lib/tools-registry.ts

# Layout component
mv TOOLS_PLATFORM_LAYOUT.tsx src/components/tools/ToolLayout.tsx

# Dynamic route page
mv TOOLS_PLATFORM_SLUG_PAGE.tsx src/app/tools/[slug]/page.tsx

# Tools listing page
mv TOOLS_PLATFORM_LISTING_PAGE.tsx src/app/tools/page.tsx

# Tool implementations
mkdir -p src/components/tools/impl
mv TOOLS_IMPL_WORDCOUNTER.tsx src/components/tools/impl/WordCounter.tsx
mv TOOLS_IMPL_JSONFORMATTER.tsx src/components/tools/impl/JsonFormatter.tsx
mv TOOLS_IMPL_BASE64.tsx src/components/tools/impl/Base64Encoder.tsx

STEP 3: Update import paths in the files
────────────────────────────────────────

After moving, ensure these imports work:
- @/types/tool → src/types/tool.ts
- @/lib/tools-registry → src/lib/tools-registry.ts
- @/components/tools/ToolLayout → src/components/tools/ToolLayout.tsx

STEP 4: Deploy to Ubuntu Server
───────────────────────────────

# Copy deploy.sh to your server and run:
chmod +x deploy.sh
sudo ./deploy.sh
```

## Final Directory Structure

```
codelithlabs-web/
├── src/
│   ├── app/
│   │   ├── tools/
│   │   │   ├── page.tsx              # Tools listing (/tools)
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Dynamic tool routes (/tools/word-counter)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   └── tools/
│   │       ├── ToolLayout.tsx        # Ad-optimized layout
│   │       └── impl/                 # Tool implementations
│   │           ├── WordCounter.tsx
│   │           ├── JsonFormatter.tsx
│   │           ├── Base64Encoder.tsx
│   │           └── ... (add more tools)
│   ├── lib/
│   │   └── tools-registry.ts         # Central tool definitions
│   └── types/
│       └── tool.ts                   # TypeScript types
├── deploy.sh                         # Ubuntu deployment script
├── docker-compose.yml                # Optimized for 8GB RAM
├── Dockerfile                        # Multi-stage build
└── next.config.mjs                   # Standalone output enabled
```

## RAM Budget (8GB Server)

| Component       | Memory Limit | Reserved  |
|-----------------|--------------|-----------|
| Ubuntu OS       | ~1GB         | ~1GB      |
| Next.js App     | 1GB          | 256MB     |
| Nginx           | 128MB        | 32MB      |
| Docker overhead | ~200MB       | -         |
| Build buffer    | ~5GB         | -         |
| **Total**       | **~2.5GB**   | **5.5GB free** |

## Adding New Tools

1. Add to `src/lib/tools-registry.ts`:
```ts
{
  slug: 'my-new-tool',
  name: 'My New Tool',
  description: 'What it does',
  category: 'text',
  keywords: ['keyword1', 'keyword2'],
  processingType: 'client'  // Always prefer 'client' for RAM savings
}
```

2. Create implementation in `src/components/tools/impl/MyNewTool.tsx`

3. Add mapping in `src/app/tools/[slug]/page.tsx`:
```ts
'my-new-tool': dynamic(() => import('@/components/tools/impl/MyNewTool'))
```

## AdSense Integration

Replace placeholders in `ToolLayout.tsx`:
```tsx
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"  // Your Publisher ID
data-ad-slot="XXXXXXXXXX"                  // Your Ad Slot ID
```

## Performance Tips

1. **All tools use client-side processing** - No server RAM usage
2. **Dynamic imports** - Tools are code-split and lazy-loaded
3. **Static generation** - Tool pages pre-built at compile time
4. **Nginx caching** - Static assets cached at edge
5. **Gzip compression** - Enabled for all responses
