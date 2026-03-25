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

async function parseInventory() {
  console.log('=== Parsing Inventory page ===\n');
  
  const html = await fetchUrl('https://tlidb.com/en/Inventory');
  
  // 查找所有分类链接
  const links = [];
  
  // 查找 <li> 或 <div> 中的链接
  const patterns = [
    /<li[^>]*>.*?<a[^>]*href=["'](\/en\/[^"']+)["'][^>]*>([^<]+)<\/a>.*?<\/li>/gi,
    /<div[^>]*class=["'][^"']*item[^"']*["'][^>]*>.*?<a[^>]*href=["'](\/en\/[^"']+)["'][^>]*>([^<]+)<\/a>/gi,
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const href = match[1];
      const text = match[2].trim();
      
      if (href && text && 
          !href.includes('.') && 
          !href.includes('#') &&
          !href.includes('?')) {
        links.push({ href, text });
      }
    }
  });
  
  // 去重
  const uniqueLinks = [];
  const seen = new Set();
  links.forEach(link => {
    const key = link.href;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueLinks.push(link);
    }
  });
  
  console.log(`Found ${uniqueLinks.length} unique links:\n`);
  
  // 按类型分组
  const gearLinks = uniqueLinks.filter(l => {
    const slug = l.href.replace('/en/', '');
    return slug.match(/^(Claw|Sword|Axe|Hammer|Staff|Rod|Wand|Bow|Crossbow|Gun|Pistol|Musket|Cannon|Dagger|Scythe|Maul|Spear)/i) ||
           slug.match(/_Helmet|_Gloves|_Boots|_Belt|_Ring|_Necklace|_Shield|_One_Handed|_Two_Handed/i);
  });
  
  const stashLinks = uniqueLinks.filter(l => {
    const slug = l.href.replace('/en/', '');
    return slug.includes('_Waistguard') || 
           slug.includes('_Breastpin') ||
           slug.includes('_Plume') ||
           slug.includes('_Reversal') ||
           slug.includes('_Waist') ||
           slug.includes('_Bracelet') ||
           slug.includes('_Ornament');
  });
  
  console.log('=== Equipment Links (Equipment) ===');
  uniqueLinks.forEach((link, idx) => {
    const slug = link.href.replace('/en/', '');
    // 排除非装备链接
    if (!slug.match(/^(Hero|Talent|Inventory|Legendary|Recipe|Pactspirit|Craft|Black|Active|Support|Passive|Netherrealm|Destiny|Enchant|Corruption|Dream|Tower|God|Profession)/i)) {
      console.log(`  ${link.text}`);
      console.log(`     ${link.href}`);
    }
  });
  
  console.log(`\n\nTotal equipment links: ${uniqueLinks.length}`);
}

parseInventory();
