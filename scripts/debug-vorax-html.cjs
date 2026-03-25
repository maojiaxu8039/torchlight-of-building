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

async function debugVoraxLimb() {
  console.log('=== Debugging Vorax Limb: Hands ===\n');

  try {
    const html = await fetchUrl('https://tlidb.com/en/Vorax_Limb%3A_Hands');

    console.log(`HTML size: ${html.length}`);

    // Check for data-modifier-id
    const modifierIds = (html.match(/data-modifier-id/g) || []).length;
    console.log(`data-modifier-id count: ${modifierIds}`);

    // Check for table rows
    const trs = (html.match(/<tr/g) || []).length;
    console.log(`<tr> count: ${trs}`);

    // Try different patterns
    const tds = (html.match(/<td/g) || []).length;
    console.log(`<td> count: ${tds}`);

    // Check for the specific text
    if (html.includes('Vorax Limb')) {
      console.log('\n✅ Found "Vorax Limb" in HTML');
    }

    // Find the title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
      console.log(`Page title: ${titleMatch[1]}`);
    }

    // Try to find the actual content structure
    const tables = (html.match(/<table/g) || []).length;
    console.log(`<table> count: ${tables}`);

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

debugVoraxLimb();
