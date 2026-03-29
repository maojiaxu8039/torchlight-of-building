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
  
  // 查找包含 "物理技能等级" 的内容
  const idx = html.indexOf('物理技能等级');
  if (idx !== -1) {
    console.log('Found at index:', idx);
    console.log('Context:', html.substring(Math.max(0, idx - 100), idx + 50));
  }
  
  // 查找 ID 140520600
  const regex = /data-modifier-id="140520600"[^>]*>([\s\S]{0,300})/gi;
  const match = regex.exec(html);
  if (match) {
    console.log('\nID 140520600:');
    console.log(match[0]);
  }
}

check();
