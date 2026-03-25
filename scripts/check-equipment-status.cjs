const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, length: data.length }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

const equipmentList = [
  // 头部
  { url: 'STR_Helmet', name: '力量头部' },
  { url: 'DEX_Helmet', name: '敏捷头部' },
  { url: 'INT_Helmet', name: '智慧头部' },
  // 胸甲
  { url: 'STR_Chest_Armor', name: '力量胸甲' },
  { url: 'DEX_Chest_Armor', name: '敏捷胸甲' },
  { url: 'INT_Chest_Armor', name: '智慧胸甲' },
  // 手套
  { url: 'STR_Gloves', name: '力量手套' },
  { url: 'DEX_Gloves', name: '敏捷手套' },
  { url: 'INT_Gloves', name: '智慧手套' },
  // 鞋子
  { url: 'STR_Boots', name: '力量鞋子' },
  { url: 'DEX_Boots', name: '敏捷鞋子' },
  { url: 'INT_Boots', name: '智慧鞋子' },
  // 单手
  { url: 'Claw', name: '爪' },
  { url: 'Dagger', name: '匕首' },
  { url: 'One-Handed_Sword', name: '单手剑' },
  { url: 'One-Handed_Hammer', name: '单手锤' },
  { url: 'One-Handed_Axe', name: '单手斧' },
  { url: 'Staff', name: '法杖' },
  { url: 'Rod', name: '灵杖' },
  { url: 'Wand', name: '魔杖' },
  { url: 'Cane', name: '手杖' },
  { url: 'Pistol', name: '手枪' },
  // 双手
  { url: 'Two-Handed_Sword', name: '双手剑' },
  { url: 'Two-Handed_Hammer', name: '双手锤' },
  { url: 'Two-Handed_Axe', name: '双手斧' },
  { url: 'Tin_Staff', name: '锡杖' },
  { url: 'War_Staff', name: '武杖' },
  { url: 'Bow', name: '弓' },
  { url: 'Crossbow', name: '弩' },
  { url: 'Musket', name: '火枪' },
  { url: 'Fire_Cannon', name: '火炮' },
  // 盾牌
  { url: 'STR_Shield', name: '力量盾牌' },
  { url: 'DEX_Shield', name: '敏捷盾牌' },
  { url: 'INT_Shield', name: '智慧盾牌' },
  // 饰品
  { url: 'Necklace', name: '项链' },
  { url: 'Ring', name: '戒指' },
  { url: 'Belt', name: '腰带' },
  { url: 'Spirit_Ring', name: '灵戒' },
  // 英雄
  { url: 'Memory', name: '英雄追忆' },
  { url: 'Divinity_Slate', name: '神格石板' },
  { url: 'Destiny', name: '命运' },
  { url: 'Prism', name: '异度棱镜' },
];

async function checkAll() {
  console.log('=== 装备页面抓取状态检查 ===\n');
  
  let success = 0;
  let failed = 0;
  
  for (const item of equipmentList) {
    const result = await fetchUrl(`https://tlidb.com/en/${item.url}`);
    const status = result.status === 200 && result.length > 1000 ? '✅' : '❌';
    
    if (status === '✅') {
      success++;
    } else {
      failed++;
    }
    
    console.log(`${status} ${item.name} (${item.url}) - ${result.status} - ${result.length} chars`);
  }
  
  console.log(`\n=== 统计 ===`);
  console.log(`成功: ${success}`);
  console.log(`失败: ${failed}`);
}

checkAll();
