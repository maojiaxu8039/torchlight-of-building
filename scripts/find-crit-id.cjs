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

async function main() {
  const pages = ['DEX_Boots', 'STR_Boots', 'INT_Boots'];
  
  for (const page of pages) {
    const html = await fetchUrl(`https://tlidb.com/cn/${page}`);
    const regex = /data-modifier-id="(\d+)"[^>]*>([\s\S]{0,500})/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
      if (match[2].includes('暴击值') && match[2].includes('100')) {
        console.log(`Page: ${page}, ID: ${match[1]}`);
        console.log('Content:', match[2].substring(0, 200));
        console.log('---');
        break;
      }
    }
  }
}

main();
