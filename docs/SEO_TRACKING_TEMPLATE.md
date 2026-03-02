# SEO Distribution Tracking Dashboard

Track SEO distribution efforts weekly using this template.

## Week of: [Date]

### IndexNow Submissions
- [ ] Blog post URLs submitted: 
- [ ] Tool page URLs submitted: 
- [ ] Total URLs indexed this week: 
- [ ] Search engines notified: Bing ☐ Yandex ☐ IndexNow ☐

### Cross-posting (Canonical)
- [ ] Dev.to posts published: 
  - [ ] [Post title 1] - Views: __ | Reactions: __
  - [ ] [Post title 2] - Views: __ | Reactions: __
- [ ] Hashnode posts published: 
  - [ ] [Post title 1] - Views: __ | Reactions: __

### Social Media Distribution
- [ ] Twitter/X posts: 
  - [ ] [Post 1] - Impressions: __ | Engagements: __
  - [ ] [Post 2] - Impressions: __ | Engagements: __
- [ ] LinkedIn posts: 
  - [ ] [Post 1] - Impressions: __ | Engagements: __

### Reddit/Community Engagement
- [ ] Subreddits engaged: 
- [ ] Value-first responses: 
- [ ] Link mentions (non-spammy): 

### Google Search Console Metrics
- Total Impressions: __
- Total Clicks: __
- Average CTR: __%
- Average Position: __

#### Top Performing Pages
1. [Page URL] - Impressions: __ | Clicks: __ | CTR: __%
2. [Page URL] - Impressions: __ | Clicks: __ | CTR: __%
3. [Page URL] - Impressions: __ | Clicks: __ | CTR: __%

#### Top Queries
1. [Query] - Impressions: __ | Clicks: __ | Position: __
2. [Query] - Impressions: __ | Clicks: __ | Position: __
3. [Query] - Impressions: __ | Clicks: __ | Position: __

### Newsletter Signups
- Total signups this week: __
- Source breakdown:
  - Blog posts: __
  - Tool pages: __
  - Pricing page: __
  - Other: __

### Ad Revenue (if applicable)
- Total impressions: __
- Total clicks: __
- Revenue: ₹__
- RPM: ₹__

### Internal Link Clicks (Google Analytics)
- Most clicked internal links from blog posts: 
  1. [Link] - Clicks: __
  2. [Link] - Clicks: __

### Action Items for Next Week
- [ ] 
- [ ] 
- [ ] 

### Notes & Observations
-
-
-

---

## Commands Used This Week

```bash
# Submit URLs to IndexNow
node scripts/seo-automation.js submit --urls scripts/seo-urls.txt

# Generate Twitter post for new content
node scripts/seo-automation.js generate --content content/blog/post-slug.md --platform twitter

# Generate LinkedIn post
node scripts/seo-automation.js generate --content content/blog/post-slug.md --platform linkedin

# Check indexing status
node scripts/seo-automation.js status
```

