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
  
  // 查找 Gear 和 Stash 部分
  const gearSection = html.match(/Gear[^<]*<\/h2>([\s\S]*?)<h2[^>]*>/i);
  const stashSection = html.match(/Stash[^<]*<\/h2>([\s\S]*?)<h2[^>]*>/i);
  
  console.log('Gear section found:', !!gearSection);
  console.log('Stash section found:', !!stashSection);
  
  // 提取链接
  function extractLinks(sectionHtml) {
    const links = [];
    const linkPattern = /href=["'](\/en\/[^"']+)["'][^>]*>([^<]+)<\/a>/gi;
    let match;
    
    while ((match = linkPattern.exec(sectionHtml)) !== null) {
      const href = match[1];
      const text = match[2].trim();
      
      if (href && text && !href.includes('.') && !href.includes('#')) {
        links.push({ href, text });
      }
    }
    
    return links;
  }
  
  // 查找所有分类部分
  const categories = [
    { name: 'Gear', pattern: /Gear<\/h[23]>([\s\S]*?)(?:<h[23][^>]*>|$)/i },
    { name: 'Stash', pattern: /Stash<\/h[23]>([\s\S]*?)(?:<h[23][^>]*>|$)/i },
  ];
  
  categories.forEach(cat => {
    const section = html.match(cat.pattern);
    if (section) {
      console.log(`\n=== ${cat.name} ===`);
      const links = extractLinks(section[1]);
      
      // 去重
      const uniqueLinks = [];
      const seen = new Set();
      links.forEach(link => {
        const slug = link.href.replace('/en/', '');
        if (!seen.has(slug)) {
          seen.add(slug);
          uniqueLinks.push(link);
        }
      });
      
      console.log(`Found ${uniqueLinks.length} links:\n`);
      uniqueLinks.forEach((link, idx) => {
        console.log(`  ${idx + 1}. ${link.text}`);
        console.log(`     ${link.href}`);
      });
    }
  });
  
  // 也查找侧边栏导航
  console.log('\n\n=== Sidebar Navigation ===');
  
  // 查找所有 EN 链接
  const allLinks = [];
  const allLinkPattern = /href=["'](\/en\/[^"']+)["'][^>]*>([^<]+)<\/a>/gi;
  let match;
  
  while ((match = allLinkPattern.exec(html)) !== null) {
    const href = match[1];
    const text = match[2].trim();
    
    // 过滤掉导航、页脚等链接
    if (href && text && 
        !href.includes('.') && 
        !href.includes('#') &&
        !href.includes('?') &&
        href.startsWith('/en/') &&
        text.length > 1 &&
        text.length < 50) {
      allLinks.push({ href, text });
    }
  }
  
  // 去重并按类型分组
  const uniqueLinks = [];
  const seen = new Set();
  allLinks.forEach(link => {
    const key = link.href;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueLinks.push(link);
    }
  });
  
  console.log(`Total unique links: ${uniqueLinks.length}\n`);
  
  // 分类显示
  const gearLinks = uniqueLinks.filter(l => {
    const slug = l.href.replace('/en/', '').toLowerCase();
    return slug.includes('_helmet') || 
           slug.includes('_gloves') || 
           slug.includes('_boots') ||
           slug.includes('_belt') ||
           slug.includes('_ring') ||
           slug.includes('_necklace') ||
           slug.includes('_shield') ||
           slug.includes('_claw') ||
           slug.includes('_sword') ||
           slug.includes('_axe') ||
           slug.includes('_hammer') ||
           slug.includes('_staff') ||
           slug.includes('_rod') ||
           slug.includes('_wand') ||
           slug.includes('_bow') ||
           slug.includes('_crossbow') ||
           slug.includes('_gun') ||
           slug.includes('_pistol') ||
           slug.includes('_musket') ||
           slug.includes('_cannon') ||
           slug.includes('_dagger') ||
           slug.includes('_scythe') ||
           slug.includes('_maul') ||
           slug.includes('_spear');
  });
  
  const stashLinks = uniqueLinks.filter(l => {
    const slug = l.href.replace('/en/', '').toLowerCase();
    return slug.includes('_waistguard') || 
           slug.includes('_breastpin') ||
           slug.includes('_plume') ||
           slug.includes('_reversal');
  });
  
  console.log('=== Gear Links (weapon/armor) ===');
  gearLinks.forEach((link, idx) => {
    console.log(`  ${idx + 1}. ${link.text}`);
    console.log(`     ${link.href}`);
  });
  
  console.log('\n=== Stash Links (accessory) ===');
  stashLinks.forEach((link, idx) => {
    console.log(`  ${idx + 1}. ${link.text}`);
    console.log(`     ${link.href}`);
  });
}

parseInventory();
