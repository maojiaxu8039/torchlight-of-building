import { getTranslatedAffixText } from '../src/lib/affix-translator.ts';

const allAffixTypes = {
  '装备基础词缀': [
    '+64 Max Life',
    '+140 Max Energy Shield',
    '+(54–74) Max Mana',
    '+(87–117) Armor',
    '+(32–40)% Critical Strike Rating',
    '+25% Critical Strike Damage',
    '+15% Attack Speed',
    '+20% Cast Speed',
    '+(8–10)% Movement Speed',
  ],
  '抗性词缀': [
    '+(5–10)% Fire Resistance',
    '+(20–25)% Cold Resistance',
    '+(15–20)% Lightning Resistance',
    '+(10–15)% Erosion Resistance',
    '+(15–25)% All Resistance',
  ],
  '伤害词缀': [
    '+25 Physical Damage',
    '+30 Cold Damage',
    '+35 Fire Damage',
    '+40 Lightning Damage',
    '+50 Elemental Damage',
    '+20 Spell Damage',
    '+15 Attack Damage',
    '+25 Minion Damage',
    '+10 Erosion Damage',
    '+50 True Damage',
  ],
  '回复词缀': [
    '+10 Life Regeneration',
    '+15 Mana Regeneration',
    '+20 Energy Shield Regeneration',
    '+5 Life on Hit',
    '+8 Mana on Hit',
    '+3 Energy Shield on Hit',
  ],
  '属性词缀': [
    '+25 Strength',
    '+20 Dexterity',
    '+30 Intelligence',
    '+15 All Stats',
    '+5 to All Attributes',
  ],
  '技能词缀': [
    '+2 Skill Level',
    '+15% Skill Cost',
    '+20% Skill Area',
    '+10% Skill Effect Duration',
    '+25% Cooldown Recovery Speed',
    '+1 Projectile Speed',
  ],
  '穿透词缀': [
    'Damage Penetrates (5–8)% Elemental Resistance',
    'Damage Penetrates (10–15)% Armor',
    '+15% Resistance Penetration',
    '+10% Damage Penetration',
  ],
  '复杂词缀 (Craft)': [
    'Reaps 0.16 s of Damage Over Time when inflicting Trauma',
    'Damage Penetrates (5–8)% Elemental Resistance',
    'Adds (36–38) - (44–46) Physical Damage to the gear',
    '+1 to Max Agility Blessing Stacks',
    'When defeated, enemies have a (20–25)% chance to explode',
  ],
  '装备名称': [
    'Elder Sage Girdle',
    'Boots of Calamity',
    'Dragon Scale Shoes',
    'Steel\'s Lament',
    'Arcanist Girdle',
  ],
};

console.log('=================================================');
console.log('     全面词缀翻译测试 - Comprehensive Affix Test     ');
console.log('=================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests: Array<{ type: string; en: string }> = [];

Object.entries(allAffixTypes).forEach(([category, tests]) => {
  console.log(`📦 ${category}:`);
  console.log('─'.repeat(60));

  tests.forEach(testCase => {
    totalTests++;
    const translated = getTranslatedAffixText(testCase);
    const hasTranslation = translated !== testCase;

    if (hasTranslation) {
      passedTests++;
      console.log(`  ✅ ${testCase.substring(0, 55).padEnd(55)}`);
      console.log(`     → ${translated.substring(0, 55)}`);
    } else {
      failedTests.push({ type: category, en: testCase });
      console.log(`  ⚠️  ${testCase}`);
      console.log(`     → (未翻译)`);
    }
    console.log('');
  });
});

console.log('=================================================');
console.log(`测试结果: ${passedTests}/${totalTests} 通过`);
console.log('=================================================');

if (passedTests === totalTests) {
  console.log('🎉 所有翻译测试通过！');
} else {
  console.log(`⚠️  还有 ${totalTests - passedTests} 个词缀未被翻译`);
  console.log('\n未翻译的词缀：');
  failedTests.forEach(({ type, en }) => {
    console.log(`  [${type}] ${en}`);
  });
}
