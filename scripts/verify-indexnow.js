#!/usr/bin/env node

/**
 * IndexNow Verification & Testing Script
 * Verifies your IndexNow setup is correct before submitting URLs
 * 
 * Usage:
 *   npm run seo:verify
 *   npm run seo:verify -- --urls urls.txt
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const API_KEY = process.env.INDEXNOW_API_KEY || '4b7800bbc0ca4c9682d90291a3cbd355';
const DOMAIN = 'codelithlabs.in';
const KEY_FILE_PATH = path.join(__dirname, '../public', `${API_KEY}.txt`);
const KEY_FILE_URL = `https://${DOMAIN}/${API_KEY}.txt`;

console.log('\n📋 IndexNow Setup Verification\n');
console.log('═'.repeat(60));

// Step 1: Verify key file exists locally
console.log('\n✓ Step 1: Check key file exists locally');
if (fs.existsSync(KEY_FILE_PATH)) {
  const content = fs.readFileSync(KEY_FILE_PATH, 'utf-8').trim();
  if (content === API_KEY) {
    console.log(`   ✅ Key file found: ${KEY_FILE_PATH}`);
    console.log(`   ✅ Content matches API key (first 16 chars): ${API_KEY.substring(0, 16)}...`);
  } else {
    console.log(`   ❌ Key file content mismatch!`);
    console.log(`      Expected: ${API_KEY}`);
    console.log(`      Got: ${content}`);
  }
} else {
  console.log(`   ❌ Key file not found at: ${KEY_FILE_PATH}`);
  console.log(`   💡 Run: echo "${API_KEY}" > public/${API_KEY}.txt`);
}

// Step 2: Verify key file is accessible
console.log('\n✓ Step 2: Verify key file is accessible online');
console.log(`   🔗 Testing: ${KEY_FILE_URL}`);

https.get(KEY_FILE_URL, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 200) {
      data = data.trim();
      if (data === API_KEY) {
        console.log(`   ✅ Key file accessible (HTTP ${res.statusCode})`);
        console.log(`   ✅ Content matches API key`);
        Step3_SubmitTestURL();
      } else {
        console.log(`   ⚠️  Key file found but content mismatch (HTTP ${res.statusCode})`);
        console.log(`      Expected: ${API_KEY}`);
        console.log(`      Got: ${data.substring(0, 50)}...`);
      }
    } else {
      console.log(`   ❌ HTTP ${res.statusCode} - File may not be accessible`);
      console.log(`   💡 Ensure the file is deployed and publicly accessible`);
    }
  });
}).on('error', (err) => {
  console.log(`   ❌ Network error: ${err.message}`);
  console.log(`   💡 Ensure your domain is accessible and DNS is configured`);
});

function Step3_SubmitTestURL() {
  // Step 3: Submit a test URL
  console.log('\n✓ Step 3: Submit test URL to IndexNow');
  
  const testURL = `https://${DOMAIN}/`;
  const postData = JSON.stringify({
    host: DOMAIN,
    key: API_KEY,
    keyLocation: KEY_FILE_URL,
    urlList: [testURL],
  });

  console.log(`   📝 Submitting: ${testURL}`);
  console.log(`   🔐 Key: ${API_KEY.substring(0, 16)}...`);
  console.log(`   📍 Key Location: ${KEY_FILE_URL}`);

  const url = new URL('https://api.indexnow.org/indexnow');
  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const req = https.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => responseData += chunk);
    res.on('end', () => {
      console.log(`\n   HTTP Response: ${res.statusCode}`);
      
      switch (res.statusCode) {
        case 200:
        case 202:
          console.log(`   ✅ URL submitted successfully!`);
          console.log(`   ✅ Search engines will index it within 24-48 hours`);
          break;
        case 400:
          console.log(`   ❌ Bad request (400) - Invalid format`);
          break;
        case 403:
          console.log(`   ❌ Forbidden (403) - Key validation failed`);
          console.log(`   💡 Check if key file is accessible at: ${KEY_FILE_URL}`);
          break;
        case 422:
          console.log(`   ❌ Unprocessable Entity (422) - URL doesn't match host`);
          break;
        case 429:
          console.log(`   ❌ Too Many Requests (429) - Rate limited`);
          console.log(`   💡 Wait before submitting more URLs`);
          break;
        default:
          console.log(`   ⚠️  Unexpected status code`);
      }
      
      if (responseData) {
        try {
          console.log(`   Response: ${responseData}`);
        } catch (e) {
          // Silent fail
        }
      }

      Step4_Instructions();
    });
  });

  req.on('error', (err) => {
    console.log(`   ❌ Request failed: ${err.message}`);
    Step4_Instructions();
  });

  req.write(postData);
  req.end();
}

function Step4_Instructions() {
  console.log('\n✓ Step 4: Next Steps');
  console.log('═'.repeat(60));
  console.log(`
  1. ✅ Verify your domain ownership in Bing Webmaster Tools
     https://www.bing.com/webmasters/home

  2. 📊 Monitor indexing progress
     https://www.bing.com/webmasters/

  3. 🚀 Submit bulk URLs using:
     npm run seo:submit -- --urls scripts/seo-urls.txt

  4. 📈 Track metrics using SEO_TRACKING_TEMPLATE.md

  5. 🔄 Set up weekly submissions for new content
     npm run seo:generate -- --content <path> --platform twitter
  `);

  console.log('═'.repeat(60));
  console.log('\n✨ IndexNow setup verification complete!\n');
}
