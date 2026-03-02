#!/usr/bin/env node

/**
 * SEO Distribution Automation Script
 * Automates URL submission, social media post generation, and SEO tracking
 * 
 * Usage:
 *   npm run seo:submit -- --urls urls.txt
 *   npm run seo:generate-posts -- --template twitter
 *   npm run seo:index-status
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const config = {
  siteDomain: 'https://codelithlabs.in',
  indexNowKey: process.env.INDEXNOW_API_KEY || 'your-indexnow-key-here',
  searchEngines: {
    bing: 'https://www.bing.com/indexnow',
    yandex: 'https://yandex.com/indexnow',
    indexNow: 'https://api.indexnow.org/indexnow',
  },
  social: {
    twitter: {
      maxLength: 280,
      hashtagLimit: 2,
    },
    linkedin: {
      maxLength: 3000,
      hashtagLimit: 5,
    },
  },
};

// IndexNow URL Submission
async function submitToIndexNow(urls) {
  const urlList = Array.isArray(urls) ? urls : [urls];
  
  const postData = JSON.stringify({
    host: new URL(config.siteDomain).hostname,
    key: config.indexNowKey,
    keyLocation: `${config.siteDomain}/${config.indexNowKey}.txt`,
    urlList: urlList,
  });

  const promises = Object.entries(config.searchEngines).map(([name, endpoint]) => {
    return new Promise((resolve, reject) => {
      const url = new URL(endpoint);
      const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200 || res.statusCode === 202) {
            console.log(`✅ ${name}: Successfully submitted ${urlList.length} URLs (${res.statusCode})`);
            resolve({ name, success: true, urls: urlList.length });
          } else {
            console.log(`⚠️  ${name}: Submission returned status ${res.statusCode}`);
            resolve({ name, success: false, statusCode: res.statusCode });
          }
        });
      });

      req.on('error', (err) => {
        console.error(`❌ ${name}: Network error -`, err.message);
        reject({ name, error: err.message });
      });

      req.write(postData);
      req.end();
    });
  });

  try {
    const results = await Promise.allSettled(promises);
    console.log('\n📊 Submission Summary:');
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const { name, success, urls } = result.value;
        console.log(`   ${success ? '✅' : '⚠️'} ${name}: ${success ? `${urls} URLs submitted` : 'Failed'}`);
      } else {
        console.log(`   ❌ ${result.reason.name}: ${result.reason.error}`);
      }
    });
  } catch (err) {
    console.error('Unexpected error during submission:', err);
  }
}

// Generate social media posts from content
function generateSocialPosts(contentPath, platform = 'twitter') {
  if (!fs.existsSync(contentPath)) {
    console.error(`❌ Content file not found: ${contentPath}`);
    return;
  }

  const content = fs.readFileSync(contentPath, 'utf-8');
  const frontmatter = parseFrontmatter(content);
  
  if (!frontmatter) {
    console.error('❌ Could not parse frontmatter from content file');
    return;
  }

  const { title, description, slug, category } = frontmatter;
  const url = `${config.siteDomain}/${category === 'blog' ? 'blog' : 'tools'}/${slug}`;

  console.log(`\n🐦 ${platform.toUpperCase()} POST GENERATED:\n`);
  console.log('─'.repeat(60));
  
  if (platform === 'twitter') {
    const post = generateTwitterPost(title, description, url);
    console.log(post);
    console.log('─'.repeat(60));
    console.log(`Character count: ${post.length}/${config.social.twitter.maxLength}`);
  } else if (platform === 'linkedin') {
    const post = generateLinkedInPost(title, description, url);
    console.log(post);
    console.log('─'.repeat(60));
    console.log(`Character count: ${post.length}/${config.social.linkedin.maxLength}`);
  } else {
    console.error(`❌ Unsupported platform: ${platform}`);
  }
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]+?)\n---/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split('\n');
  
  lines.forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      let value = valueParts.join(':').trim();
      value = value.replace(/^["']|["']$/g, ''); // Remove quotes
      frontmatter[key.trim()] = value;
    }
  });

  return frontmatter;
}

function generateTwitterPost(title, description, url) {
  // Extract key point from description
  const keyPoint = description.split('.')[0] + '.';
  
  const template = `${keyPoint}

New guide: ${title}

${url}

#WebDev #DevTools`;

  return template;
}

function generateLinkedInPost(title, description, url) {
  const template = `📘 ${title}

${description}

🔗 Read the full guide: ${url}

Would love to hear your thoughts and experiences!

#WebDevelopment #DeveloperTools #Productivity #TechTools`;

  return template;
}

// Check indexing status (placeholder - requires Google Search Console API)
async function checkIndexingStatus() {
  console.log('📊 Indexing Status Check\n');
  console.log('⚠️  To check actual indexing status, you need to:');
  console.log('   1. Set up Google Search Console API credentials');
  console.log('   2. Install @googleapis/searchconsole package');
  console.log('   3. Authenticate with service account');
  console.log('\nFor now, use Google Search Console UI:');
  console.log(`   https://search.google.com/search-console?resource_id=${config.siteDomain}`);
}

// Main CLI handler
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'submit' || command === '--submit') {
    const urlsArg = args.indexOf('--urls') + 1;
    if (!urlsArg || !args[urlsArg]) {
      console.error('❌ Usage: npm run seo:submit -- --urls <file-or-url>');
      return;
    }

    const urlInput = args[urlsArg];
    let urls = [];

    if (fs.existsSync(urlInput)) {
      // Read URLs from file
      urls = fs.readFileSync(urlInput, 'utf-8')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && line.startsWith('http'));
      console.log(`📂 Loaded ${urls.length} URLs from ${urlInput}\n`);
    } else if (urlInput.startsWith('http')) {
      urls = [urlInput];
      console.log(`📝 Submitting single URL: ${urlInput}\n`);
    } else {
      console.error('❌ Invalid URL or file path');
      return;
    }

    submitToIndexNow(urls);
  } else if (command === 'generate' || command === '--generate') {
    const contentArg = args.indexOf('--content') + 1;
    const platformArg = args.indexOf('--platform') + 1;
    
    if (!contentArg || !args[contentArg]) {
      console.error('❌ Usage: npm run seo:generate -- --content <markdown-file> --platform <twitter|linkedin>');
      return;
    }

    const contentPath = args[contentArg];
    const platform = platformArg && args[platformArg] ? args[platformArg] : 'twitter';
    
    generateSocialPosts(contentPath, platform);
  } else if (command === 'status' || command === '--status') {
    checkIndexingStatus();
  } else {
    console.log(`
📦 SEO Distribution Automation Tool

Commands:
  submit    Submit URLs to search engines via IndexNow
  generate  Generate social media posts from content
  status    Check indexing status

Examples:
  npm run seo:submit -- --urls urls.txt
  npm run seo:submit -- --urls https://codelithlabs.in/blog/post-slug
  npm run seo:generate -- --content content/blog/post.md --platform twitter
  npm run seo:status

Environment Variables:
  INDEXNOW_API_KEY    Your IndexNow API key for URL submission
    `);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  submitToIndexNow,
  generateSocialPosts,
  checkIndexingStatus,
};
