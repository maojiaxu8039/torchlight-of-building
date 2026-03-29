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

fetchUrl('https://tlidb.com/cn/DEX_Boots').then(html => {
  // 查找包含 暴击值1000 的内容
  const idx = html.indexOf('暴击值1000');
  if (idx !== -1) {
    console.log('Found at index:', idx);
    console.log('Context:', html.substring(Math.max(0, idx - 100), idx + 50));
  } else {
    console.log('Not found "暴击值1000"');
  }
  
  // 检查是否有 tooltip 内容
  const tooltipIdx = html.indexOf('Weight: 100');
  if (tooltipIdx !== -1) {
    console.log('\nFound Weight: 100 at index:', tooltipIdx);
    console.log('Context:', html.substring(Math.max(0, tooltipIdx - 50), tooltipIdx + 100));
  }
});
