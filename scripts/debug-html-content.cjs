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

fetchUrl('https://tlidb.com/cn/Belt').then(html => {
  // 查找包含 暴击值1000 的 td 内容
  const regex = /data-modifier-id="(\d+)"[^>]*>([\s\S]{0,300})/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    if (match[2].includes('暴击值') && match[2].includes('1000')) {
      console.log('ID:', match[1]);
      console.log('Content:', match[2].substring(0, 200));
      console.log('---');
      break;
    }
  }
});
