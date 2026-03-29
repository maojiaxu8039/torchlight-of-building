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

const pages = [
  'Belt', 'Bow', 'Cane', 'Claw', 'Crossbow', 'Cudgel', 'Dagger',
  'DEX_Boots', 'DEX_Chest_Armor', 'DEX_Gloves', 'DEX_Helmet', 'DEX_Shield',
  'Fire_Cannon', 'INT_Boots', 'INT_Chest_Armor', 'INT_Gloves', 'INT_Helmet', 'INT_Shield',
  'Musket', 'Necklace', 'One-Handed_Axe', 'One-Handed_Hammer', 'One-Handed_Sword',
  'Pistol', 'Ring', 'Rod', 'Scepter', 'Spirit_Ring',
  'STR_Boots', 'STR_Chest_Armor', 'STR_Gloves', 'STR_Helmet', 'STR_Shield',
  'Tin_Staff', 'Two-Handed_Axe', 'Two-Handed_Hammer', 'Two-Handed_Sword', 'Wand'
];

async function main() {
  for (const page of pages) {
    try {
      const html = await fetchUrl(`https://tlidb.com/cn/${page}`);
      const regex = /data-modifier-id="(\d+)"[^>]*>([\s\S]{0,500})/gi;
      let match;
      while ((match = regex.exec(html)) !== null) {
        if (match[1] === '110010100') {
          console.log(`Found in ${page}`);
          console.log('Content:', match[2].substring(0, 200));
          return;
        }
      }
    } catch (e) {
      console.log(`Error fetching ${page}: ${e.message}`);
    }
  }
  console.log('Not found');
}

main();
