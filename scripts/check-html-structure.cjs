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

async function checkHtml() {
  const html = await fetchUrl('https://tlidb.com/cn/Claw');
  
  // 查找 ID 110010100
  const regex = /data-modifier-id="110010100"[^>]*>([\s\S]{0,400})/gi;
  const match = regex.exec(html);
  if (match) {
    console.log('Raw content:');
    console.log(match[0]);
    console.log('\n---');
    
    // 模拟解析
    let text = match[1];
    console.log('After first match:');
    console.log(text.substring(0, 200));
  }
}

checkHtml();
