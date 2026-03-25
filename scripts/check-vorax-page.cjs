const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function checkPage() {
  console.log('Checking tlidb.com for Vorax Limb pages...\n');

  const pages = [
    'Vorax_Limb',
    'Vorax_Aberrant_Limb',
    'Vorax',
    'Limb',
  ];

  for (const page of pages) {
    try {
      const url = `https://tlidb.com/en/${page}`;
      console.log(`Checking: ${url}`);
      const html = await fetchUrl(url);

      if (html && html.length > 1000) {
        console.log(`  ✅ Found! HTML size: ${html.length}`);
      } else {
        console.log(`  ❌ Not found`);
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  }
}

checkPage().catch(console.error);
