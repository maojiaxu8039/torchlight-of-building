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

async function checkId() {
  const html = await fetchUrl('https://tlidb.com/cn/DEX_Boots');
  
  // 查找 ID 140510501
  const regex = /data-modifier-id="140510501"[^>]*>([\s\S]{0,500})/gi;
  const match = regex.exec(html);
  if (match) {
    console.log('Raw content:');
    console.log(match[0]);
    console.log('\n---');
    
    // 测试解析
    let text = match[1];
    console.log('After first cleanup:');
    console.log(text);
  }
}

checkId();
