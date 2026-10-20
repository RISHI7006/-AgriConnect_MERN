const fs = require('fs');
const https = require('https');

const files = [
  'backend/seed/seedData.js',
  'backend/ml/mlService.js',
  'frontend/src/pages/CropRecommendationPage.jsx',
  'frontend/src/pages/PriceTrendsPage.jsx',
  'frontend/src/pages/DemandPredictionPage.jsx',
  'frontend/src/pages/FarmerDashboard.jsx',
  'frontend/src/pages/BuyerDashboard.jsx'
];

let allText = '';
files.forEach(f => {
  if (fs.existsSync(f)) {
    allText += ' ' + fs.readFileSync(f, 'utf8');
  }
});

const regex = /https:\/\/images\.unsplash\.com\/[a-zA-Z0-9_\-\.\?\=\&]+/g;
const matches = allText.match(regex) || [];
const uniqueUrls = [...new Set(matches)];

console.log('Testing', uniqueUrls.length, 'URLs...');

async function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
      resolve({ url, status: res.statusCode });
    });
    req.on('error', (e) => resolve({ url, status: 'ERROR: ' + e.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ url, status: 'TIMEOUT' });
    });
    req.end();
  });
}

(async () => {
  const bad = [];
  for (const u of uniqueUrls) {
    const res = await checkUrl(u);
    if (res.status !== 200 && res.status !== 302 && res.status !== 301) {
      console.log('FAILED:', res.status, u);
      bad.push(u);
    }
  }
  console.log('Completed checking. Total failed:', bad.length);
  fs.writeFileSync('bad_urls.json', JSON.stringify(bad, null, 2));
})();
