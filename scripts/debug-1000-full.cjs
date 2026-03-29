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
  // 查找包含 暴击值1000 的内容
  const index = html.indexOf('暴击值1000');
  if (index !== -1) {
    console.log('Found at index:', index);
    console.log('Context:', html.substring(Math.max(0, index - 200), index + 100));
  } else {
    console.log('Not found exact match');
  }
  
  // 查找包含 暴击值 和 1000 接近的内容
  const regex = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)(?=<i\s|data-modifier-id="|$)/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    if (match[2].includes('暴击值') && match[2].includes('1000')) {
      console.log('\nID:', match[1]);
      console.log('Text:', match[2]);
      break;
    }
  }
});
