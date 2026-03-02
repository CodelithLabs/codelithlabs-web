# 🔑 IndexNow Setup Checklist — CodelithLabs

Your IndexNow API key has been generated and configured. Follow this checklist to verify everything is working correctly.

---

## ✅ Setup Verification Checklist

### Phase 1: Local Verification

- [x] **API Key Generated**: `4b7800bbc0ca4c9682d90291a3cbd355`
- [x] **Key File Created**: `public/4b7800bbc0ca4c9682d90291a3cbd355.txt`
- [x] **Environment Variables Added**: `.env.local` and `.env.example`
- [x] **Verification Script Created**: `scripts/verify-indexnow.js`
- [ ] **Run Local Verification**: 
  ```bash
  npm run seo:verify
  ```

### Phase 2: Deployment to Vercel

- [ ] **Push to GitHub**:
  ```bash
  git add public/4b7800bbc0ca4c9682d90291a3cbd355.txt .env.local .env.example
  git commit -m "chore: add IndexNow API configuration"
  git push origin main
  ```

- [ ] **Wait for Vercel Deployment**:
  - GitHub Actions runs tests
  - Vercel automatically deploys if tests pass
  - Site updates at: https://codelithlabs.in

- [ ] **Verify Key File is Accessible**:
  ```
  Visit: https://codelithlabs.in/4b7800bbc0ca4c9682d90291a3cbd355.txt
  Expected: Plain text containing your API key
  ```

### Phase 3: Bing Webmaster Tools Setup

- [ ] **Go to Bing Webmaster Tools**:
  ```
  https://www.bing.com/webmasters/
  ```

- [ ] **Add Your Site**:
  1. Click "Add Site"
  2. Enter: `https://codelithlabs.in`
  3. Select "HTML file upload" verification method
  4. Download verification file and place in `public/`
  5. Reupload and wait for verification (5-30 minutes)

- [ ] **Verify Domain Ownership**:
  - Once verified, Bing will trust IndexNow submissions from your domain
  - You'll see submission statistics in Webmaster Tools

### Phase 4: Submit URLs to IndexNow

- [ ] **Test Single URL Submission**:
  ```bash
  npm run seo:submit -- --urls https://codelithlabs.in/
  ```
  Expected output:
  ```
  ✅ bing: Successfully submitted 1 URLs (200)
  ✅ yandex: Successfully submitted 1 URLs (202)
  ✅ indexNow: Successfully submitted 1 URLs (200)
  ```

- [ ] **Submit Bulk URLs**:
  ```bash
  npm run seo:submit -- --urls scripts/seo-urls.txt
  ```
  This submits 40+ high-priority URLs (blog posts, tools, core pages)

- [ ] **Monitor Indexing Progress**:
  - Go to Bing Webmaster Tools
  - Check "Fetch as Bingbot" status
  - URLs should appear in index within 24-48 hours

### Phase 5: Automate Weekly Submissions

- [ ] **Set Up Cron Job** (Optional - for automatic submissions):
  ```bash
  # Every Monday at 9 AM, submit new URLs
  0 9 * * MON npm run seo:submit -- --urls scripts/seo-urls.txt
  ```

- [ ] **Generate Social Media Posts** (for new content):
  ```bash
  # When publishing new blog post
  npm run seo:generate -- --content content/blog/new-post.md --platform twitter
  npm run seo:generate -- --content content/blog/new-post.md --platform linkedin
  ```

- [ ] **Track Weekly Metrics**:
  - Use: `docs/SEO_TRACKING_TEMPLATE.md`
  - Log impressions, clicks, CTR from Google Search Console
  - Monitor IndexNow indexing status

---

## 📊 File Overview

| File | Purpose | Status |
|------|---------|--------|
| `public/4b7800bbc0ca4c9682d90291a3cbd355.txt` | IndexNow key verification | ✅ Created |
| `.env.local` | API key for local development | ✅ Updated |
| `.env.example` | API key reference for production | ✅ Updated |
| `scripts/verify-indexnow.js` | Verification & testing script | ✅ Created |
| `scripts/seo-automation.js` | URL submission & social post generation | ✅ Exists |
| `scripts/seo-urls.txt` | Bulk URL list for submission | ✅ Exists |
| `docs/SEO_TRACKING_TEMPLATE.md` | Weekly tracking dashboard | ✅ Exists |

---

## 🧪 Quick Test Commands

```bash
# 1. Verify IndexNow setup is correct
npm run seo:verify

# 2. Submit URLs (after deployment)
npm run seo:submit -- --urls https://codelithlabs.in/

# 3. Generate Twitter post (for new content)
npm run seo:generate -- --content content/blog/example.md --platform twitter

# 4. Generate LinkedIn post
npm run seo:generate -- --content content/blog/example.md --platform linkedin

# 5. Submit all URLs from file
npm run seo:submit -- --urls scripts/seo-urls.txt
```

---

## 🔍 How IndexNow Works

```
                          Your Website
                     https://codelithlabs.in
                              |
                    (publishes new content)
                              |
                    ┌─────────┴─────────┐
                    |                   |
              (IndexNow API)     (Traditional Crawling)
                    |                   |
        Submit URLs automatically   Wait for bots
                    |                   |
          ┌─────────┴─────────┐         |
          |                   |         |
        Bing              Yandex    Google
       (30min)            (1hour)   (7-14 days)
          |                   |         |
        Indexed            Indexed   Indexed
```

**IndexNow = Instant notifications to search engines**
- No waiting for crawlers to discover changed pages
- Bing indexes within 30 minutes
- Yandex within 1-4 hours
- Reduces to months worth of indexing delay

---

## ✨ Next Steps

1. **Run verification**: `npm run seo:verify`
2. **Deploy to Vercel**: Push to GitHub
3. **Verify key file**: Check `https://codelithlabs.in/4b7800bbc0ca4c9682d90291a3cbd355.txt`
4. **Set up Bing Webmaster Tools**: Verify domain ownership
5. **Submit URLs**: `npm run seo:submit -- --urls scripts/seo-urls.txt`
6. **Monitor progress**: Check Bing Webmaster Tools daily

---

## 🆘 Troubleshooting

### Key file returns 404
- ✅ Ensure `public/4b7800bbc0ca4c9682d90291a3cbd355.txt` exists
- ✅ Run Vercel deployment after pushing to GitHub
- ✅ Wait 5 minutes for deployment to complete

### Submissions return 403 (Forbidden)
- ✅ Check key file is accessible: `https://codelithlabs.in/4b7800bbc0ca4c9682d90291a3cbd355.txt`
- ✅ Verify file content matches API key exactly
- ✅ Wait for Vercel deployment to complete

### Submissions return 422 (Unprocessable Entity)
- ✅ Ensure URLs belong to `codelithlabs.in` domain
- ✅ Check URL format is valid (should start with `https://`)
- ✅ Verify host parameter in submission is `codelithlabs.in`

### URLs not appearing in Bing index
- ✅ IndexNow doesn't guarantee indexing, just notification
- ✅ Verify site ownership in Bing Webmaster Tools
- ✅ Use "Fetch as Bingbot" tool to test crawlability
- ✅ Check site has no robots.txt blocking

---

## 📚 External Resources

- **IndexNow Documentation**: https://www.indexnow.org/documentation
- **Bing Webmaster Tools**: https://www.bing.com/webmasters/
- **Google Search Console**: https://search.google.com/search-console
- **Vercel Environment Variables**: https://vercel.com/docs/concepts/deployments/environment-variables

---

## 📝 API Key Details

| Parameter | Value |
|-----------|-------|
| **API Key** | `4b7800bbc0ca4c9682d90291a3cbd355` |
| **Domain** | `codelithlabs.in` |
| **Key File URL** | `https://codelithlabs.in/4b7800bbc0ca4c9682d90291a3cbd355.txt` |
| **Protocol** | IndexNow (supports Bing, Yandex, and all IndexNow-compatible engines) |

✅ **Status**: Ready to deploy

---

*Setup completed: March 3, 2026*
