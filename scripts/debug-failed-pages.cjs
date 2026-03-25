const https = require('https');
const fs = require('fs');
const path = require('path');

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

// 之前失败的页面
const failedPages = [
  'Hero', 'Talent', 'Inventory', 'Recipe', 'Pactspirit', 'Black_Market',
  'Drop_Source', 'Active_Skill', 'Support_Skill', 'Passive_Skill',
  'Triggered_Skill', 'Activation_Medium_Skill', 'Noble_Support_Skill',
  'Magnificent_Support_Skill', 'Tip', 'Hyperlink', 'Gear_Empowerment',
  'Path_of_Achievements', 'Path_of_Progression', 'Season_Pass', 'Event',
  'Codex', 'Trait_Decks', 'Confusion_Card_Library', 'Void_Chart',
  'Compass', 'Probe', 'Path_of_the_Brave', 'Shop', 'Outfit',
  'Commodity', 'Boon'
];

async function debugPage(slug) {
  const enUrl = `https://tlidb.com/en/${slug}`;
  const cnUrl = `https://tlidb.com/cn/${slug}`;
  
  try {
    const enHtml = await fetchUrl(enUrl);
    const cnHtml = await fetchUrl(cnUrl);
    
    // 检查是否有 data-modifier-id
    const enMatches = (enHtml.match(/data-modifier-id/g) || []).length;
    const cnMatches = (cnHtml.match(/data-modifier-id/g) || []).length;
    
    // 检查其他可能的结构
    const hasTable = enHtml.includes('<table');
    const hasModifier = enHtml.includes('modifier');
    const hasSpan = enHtml.includes('<span');
    
    console.log(`${slug}:`);
    console.log(`  EN: ${enHtml.length} chars, data-modifier-id: ${enMatches}`);
    console.log(`  CN: ${cnHtml.length} chars, data-modifier-id: ${cnMatches}`);
    console.log(`  hasTable: ${hasTable}, hasModifier: ${hasModifier}, hasSpan: ${hasSpan}`);
    
    if (enMatches === 0 && cnMatches === 0) {
      // 尝试提取其他可能的内容
      const titleMatch = enHtml.match(/<title>([^<]+)<\/title>/i);
      console.log(`  Page title: ${titleMatch ? titleMatch[1] : 'N/A'}`);
    }
    
  } catch (error) {
    console.log(`${slug}: ERROR - ${error.message}`);
  }
}

async function main() {
  console.log('=== Debugging failed pages ===\n');
  
  for (const slug of failedPages) {
    await debugPage(slug);
    await new Promise(r => setTimeout(r, 100)); // 延迟避免请求过快
  }
}

main();
