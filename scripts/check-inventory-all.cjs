const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

const equipmentList = [
  // 头部
  { en: 'STR_Helmet', cn: 'STR_Helmet', name: '力量头部' },
  { en: 'DEX_Helmet', cn: 'DEX_Helmet', name: '敏捷头部' },
  { en: 'INT_Helmet', cn: 'INT_Helmet', name: '智慧头部' },
  // 胸甲
  { en: 'STR_Chest_Armor', cn: 'STR_Chest_Armor', name: '力量胸甲' },
  { en: 'DEX_Chest_Armor', cn: 'DEX_Chest_Armor', name: '敏捷胸甲' },
  { en: 'INT_Chest_Armor', cn: 'INT_Chest_Armor', name: '智慧胸甲' },
  // 手套
  { en: 'STR_Gloves', cn: 'STR_Gloves', name: '力量手套' },
  { en: 'DEX_Gloves', cn: 'DEX_Gloves', name: '敏捷手套' },
  { en: 'INT_Gloves', cn: 'INT_Gloves', name: '智慧手套' },
  // 鞋子
  { en: 'STR_Boots', cn: 'STR_Boots', name: '力量鞋子' },
  { en: 'DEX_Boots', cn: 'DEX_Boots', name: '敏捷鞋子' },
  { en: 'INT_Boots', cn: 'INT_Boots', name: '智慧鞋子' },
  // 单手
  { en: 'Claw', cn: 'Claw', name: '爪' },
  { en: 'Dagger', cn: 'Dagger', name: '匕首' },
  { en: 'One-Handed_Sword', cn: 'One-Handed_Sword', name: '单手剑' },
  { en: 'One-Handed_Hammer', cn: 'One-Handed_Hammer', name: '单手锤' },
  { en: 'One-Handed_Axe', cn: 'One-Handed_Axe', name: '单手斧' },
  { en: 'Wand', cn: 'Wand', name: '法杖' },
  { en: 'Rod', cn: 'Rod', name: '灵杖' },
  { en: 'Scepter', cn: 'Scepter', name: '魔杖' },
  { en: 'Cane', cn: 'Cane', name: '手杖' },
  { en: 'Pistol', cn: 'Pistol', name: '手枪' },
  // 双手
  { en: 'Two-Handed_Sword', cn: 'Two-Handed_Sword', name: '双手剑' },
  { en: 'Two-Handed_Hammer', cn: 'Two-Handed_Hammer', name: '双手锤' },
  { en: 'Two-Handed_Axe', cn: 'Two-Handed_Axe', name: '双手斧' },
  { en: 'Tin_Staff', cn: 'Tin_Staff', name: '锡杖' },
  { en: 'Cudgel', cn: 'Cudgel', name: '武杖' },
  { en: 'Bow', cn: 'Bow', name: '弓' },
  { en: 'Crossbow', cn: 'Crossbow', name: '弩' },
  { en: 'Musket', cn: 'Musket', name: '火枪' },
  { en: 'Fire_Cannon', cn: 'Fire_Cannon', name: '火炮' },
  // 盾牌
  { en: 'STR_Shield', cn: 'STR_Shield', name: '力量盾牌' },
  { en: 'DEX_Shield', cn: 'DEX_Shield', name: '敏捷盾牌' },
  { en: 'INT_Shield', cn: 'INT_Shield', name: '智慧盾牌' },
  // 饰品
  { en: 'Necklace', cn: 'Necklace', name: '项链' },
  { en: 'Ring', cn: 'Ring', name: '戒指' },
  { en: 'Belt', cn: 'Belt', name: '腰带' },
  { en: 'Spirit_Ring', cn: 'Spirit_Ring', name: '灵戒' },
  // 英雄
  { en: 'Memory', cn: 'Memory', name: '英雄追忆' },
  { en: 'Divinity_Slate', cn: 'Divinity_Slate', name: '神格石板' },
  { en: 'Destiny', cn: 'Destiny', name: '命运' },
  { en: 'Ethereal_Prism', cn: 'Ethereal_Prism', name: '异度棱镜' },
  // 渴瘾肢体
  { en: 'Vorax_Limb:_Head', cn: 'Vorax_Limb:_Head', name: '渴瘾肢体：脑部' },
  { en: 'Vorax_Limb:_Chest', cn: 'Vorax_Limb:_Chest', name: '渴瘾肢体：胸部' },
  { en: 'Vorax_Limb:_Hands', cn: 'Vorax_Limb:_Hands', name: '渴瘾肢体：手部' },
  { en: 'Vorax_Limb:_Legs', cn: 'Vorax_Limb:_Legs', name: '渴瘾肢体：腿部' },
  { en: 'Vorax_Aberrant_Limb:_Legs', cn: 'Vorax_Aberrant_Limb:_Legs', name: '渴瘾异肢：腿部' },
  { en: 'Vorax_Limb:_Neck', cn: 'Vorax_Limb:_Neck', name: '渴瘾肢体：颈部' },
  { en: 'Vorax_Limb:_Digits', cn: 'Vorax_Limb:_Digits', name: '渴瘾肢体：指部' },
  { en: 'Vorax_Aberrant_Limb:_Digits', cn: 'Vorax_Aberrant_Limb:_Digits', name: '渴瘾异肢：指部' },
  { en: 'Vorax_Limb:_Waist', cn: 'Vorax_Limb:_Waist', name: '渴瘾肢体：腰部' },
  { en: 'Vorax_Aberrant_Limb:_Waist', cn: 'Vorax_Aberrant_Limb:_Waist', name: '渴瘾异肢：腰部' },
];

function encodeSlug(slug) {
  return slug.replace(/:/g, '%3A');
}

async function checkPage(enSlug, name) {
  const encodedSlug = encodeSlug(enSlug);
  const result = await fetchUrl(`https://tlidb.com/en/${encodedSlug}`);
  const hasPage = result.status === 200 && result.data.length > 1000;
  return { name, en: enSlug, status: hasPage ? '✅' : '❌', size: result.data.length };
}

async function main() {
  console.log('=== Inventory 装备页面抓取状态 ===\n');
  
  let success = 0;
  let failed = 0;
  
  for (const item of equipmentList) {
    const result = await checkPage(item.en, item.name);
    
    if (result.status === '✅') {
      success++;
    } else {
      failed++;
    }
    
    console.log(`${result.status} ${result.name} (${result.en}) - ${result.size} chars`);
  }
  
  console.log(`\n=== 统计 ===`);
  console.log(`成功: ${success}`);
  console.log(`失败: ${failed}`);
  console.log(`总计: ${equipmentList.length}`);
}

main();
