const https = require('https');
const http = require('http');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const request = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    request.on('error', reject);
  });
}

async function check() {
  const html = await fetchUrl('https://tlidb.com/cn/INT_Boots');
  
  // 查找 ID 140520600
  const regex = /data-modifier-id="140520600"[^>]*>([\s\S]{0,500})/gi;
  const match = regex.exec(html);
  if (match) {
    console.log('Raw content:');
    console.log(match[0]);
    console.log('\n---');
    
    // 提取文本
    let text = match[1];
    console.log('After first match:');
    console.log(text.substring(0, 200));
  }
}

check();
