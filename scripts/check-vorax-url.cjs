const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    console.log(`Fetching: ${url}`);
    https.get(url, (res) => {
      console.log(`Status: ${res.statusCode}`);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`Data length: ${data.length}`);
        resolve(data);
      });
      res.on('error', reject);
    }).on('error', (err) => {
      console.log(`Error: ${err.message}`);
      reject(err);
    });
  });
}

async function checkUrls() {
  // 用户提供的 URL
  const urls = [
    'https://tlidb.com/en/Vorax_Limb%3A_Head',
    'https://tlidb.com/cn/Vorax_Limb%3A_Head',
    // 尝试其他变体
    'https://tlidb.com/en/Vorax_Limb:_Head',
    'https://tlidb.com/en/Vorax_Limb:_Hands',
  ];
  
  for (const url of urls) {
    try {
      const data = await fetchUrl(url);
      if (data.length > 100) {
        console.log(`Success!\n`);
      }
    } catch (error) {
      console.log(`Failed\n`);
    }
    console.log('---');
    await new Promise(r => setTimeout(r, 500));
  }
}

checkUrls();
