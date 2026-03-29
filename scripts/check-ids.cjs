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

async function checkIds() {
  const ids = ['110010100', '110010180', '110010500', '110010580'];
  
  for (const id of ids) {
    console.log('Checking ID:', id);
    
    // 检查所有可能的页面
    const pages = ['Claw', 'DEX_Boots', 'STR_Boots', 'Belt', 'DEX_Gloves'];
    
    for (const page of pages) {
      try {
        const html = await fetchUrl('https://tlidb.com/cn/' + page);
        const regex = new RegExp('data-modifier-id="' + id + '"[^>]*>([\\s\\S]{0,300})', 'gi');
        const match = regex.exec(html);
        if (match) {
          console.log('  Found in:', page);
          console.log('  Content:', match[1].substring(0, 150));
        }
      } catch (e) {
        console.log('  Error:', page, e.message);
      }
    }
    console.log('---');
  }
}

checkIds();
