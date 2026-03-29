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
  const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  let tdMatch;
  let count = 0;
  while ((tdMatch = tdRegex.exec(html)) !== null) {
    const content = tdMatch[1];
    if (content.includes('1000') && content.includes('data-modifier-id')) {
      const idMatch = content.match(/data-modifier-id="(\d+)"/);
      if (idMatch) {
        console.log('ID:', idMatch[1]);
        console.log('Content:', content.substring(0, 300));
        console.log('---');
      }
    }
    count++;
    if (count > 200) break;
  }
});
