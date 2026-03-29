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
  // 搜索所有页面中包含 "暴击值" 的词缀
  const pages = [
    'Belt', 'Bow', 'Cane', 'Claw', 'Crossbow', 'Cudgel', 'Dagger',
    'DEX_Boots', 'DEX_Chest_Armor', 'DEX_Gloves', 'DEX_Helmet', 'DEX_Shield',
    'Fire_Cannon', 'INT_Boots', 'INT_Chest_Armor', 'INT_Gloves', 'INT_Helmet', 'INT_Shield',
    'Musket', 'Necklace', 'One-Handed_Axe', 'One-Handed_Hammer', 'One-Handed_Sword',
    'Pistol', 'Ring', 'Rod', 'Scepter', 'Spirit_Ring',
    'STR_Boots', 'STR_Chest_Armor', 'STR_Gloves', 'STR_Helmet', 'STR_Shield',
    'Tin_Staff', 'Two-Handed_Axe', 'Two-Handed_Hammer', 'Two-Handed_Sword', 'Wand'
  ];
  
  console.log('搜索包含 "暴击值" 的词缀...\n');
  
  for (const page of pages) {
    try {
      const html = await fetchUrl('https://tlidb.com/cn/' + page);
      
      // 查找包含 暴击值 的 td 内容
      const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      let tdMatch;
      
      while ((tdMatch = tdRegex.exec(html)) !== null) {
        const content = tdMatch[1];
        if (content.includes('暴击值')) {
          // 提取 ID
          const idMatch = content.match(/data-modifier-id="(\d+)"/);
          if (idMatch) {
            console.log('Page:', page, ', ID:', idMatch[1]);
            // 提取词缀文本
            const textMatch = content.match(/>([^<]+暴击值[^<]*)</);
            if (textMatch) {
              console.log('Text:', textMatch[1]);
            }
            console.log('---');
          }
          break;
        }
      }
    } catch (e) {
      console.log('Error:', page, e.message);
    }
  }
}

checkId();
