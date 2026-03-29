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

// 测试 110010100 这个 ID
fetchUrl('https://tlidb.com/cn/DEX_Boots').then(html => {
  // 查找这个 ID 的词缀
  const regex = /data-modifier-id="(\d+)"[^>]*>([\s\S]{0,500})/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    if (match[1] === '110010100') {
      console.log('ID:', match[1]);
      console.log('Content:', match[2]);
      break;
    }
  }
});
