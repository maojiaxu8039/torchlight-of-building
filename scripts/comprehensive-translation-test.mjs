import { getTranslatedAffixText } from '../src/lib/affix-translator.ts';

const testScenarios = {
  '装备词缀': [
    '+140 Max Energy Shield',
    '+(150–400) Max Life',
    '+(54–74) Max Mana',
    '+(87–117) Armor',
    '+(32–40)% Critical Strike Rating',
    '+25% Critical Strike Damage',
    '+15% Attack Speed',
    '+20% Cast Speed',
    '+8–10)% Movement Speed',
  ],
  '抗性词缀': [
    '+(5–10)% Fire Resistance',
    '+(20–25)% Cold Resistance',
    '+(15–20)% Lightning Resistance',
    '+(10–15)% Erosion Resistance',
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
  ],
  '回复词缀': [
    '+10 Life Regeneration',
    '+15 Mana Regeneration',
    '+20 Energy Shield Regeneration',
    '+5 Life on Hit',
    '+8 Mana on Hit',
  ],
  '属性词缀': [
    '+25 Strength',
    '+20 Dexterity',
    '+30 Intelligence',
    '+15 All Stats',
  ],
  '技能词缀': [
    '+2 Skill Level',
    '+15% Skill Cost',
    '+20% Skill Area',
    '+10% Skill Effect Duration',
    '+25% Cooldown Recovery Speed',
  ],
};

console.log('=================================================');
console.log('   全面翻译功能测试 - Affix Translation Test   ');
console.log('=================================================\n');

let totalTests = 0;
let passedTests = 0;

Object.entries(testScenarios).forEach(([category, tests]) => {
  console.log(`📦 ${category}:`);
  console.log('─'.repeat(60));

  tests.forEach(testCase => {
    totalTests++;
    const translated = getTranslatedAffixText(testCase);
    const hasTranslation = translated !== testCase;

    if (hasTranslation) {
      passedTests++;
      console.log(`  ✅ ${testCase.padEnd(45)} → ${translated}`);
    } else {
      console.log(`  ⚠️  ${testCase.padEnd(45)} → (未翻译: ${translated})`);
    }
  });

  console.log('');
});

console.log('=================================================');
console.log(`测试结果: ${passedTests}/${totalTests} 通过`);
console.log('=================================================');

if (passedTests === totalTests) {
  console.log('🎉 所有翻译测试通过！');
} else {
  console.log(`⚠️  还有 ${totalTests - passedTests} 个词缀未被翻译`);
}
