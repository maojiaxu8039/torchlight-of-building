const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function checkStructure() {
  console.log('=== Checking HTML structure ===\n');
  
  const html = await fetchUrl('https://tlidb.com/en/Confusion_Card_Library');
  
  // 查找 data-modifier-id 的上下文
  const idx = html.indexOf('data-modifier-id');
  if (idx !== -1) {
    console.log('Found data-modifier-id at position:', idx);
    console.log('\nContext (200 chars before):');
    console.log(html.substring(Math.max(0, idx - 200), idx + 500));
  }
  
  // 检查是否有 JSON 数据
  const jsonPattern = /<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let jsonCount = 0;
  while ((match = jsonPattern.exec(html)) !== null && jsonCount < 3) {
    console.log('\n\nJSON script found:');
    console.log(match[1].substring(0, 200));
    jsonCount++;
  }
}

checkStructure();
