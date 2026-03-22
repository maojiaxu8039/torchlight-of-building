import { getTranslatedAffixText } from '../src/lib/affix-translator.ts';

const testCases = [
  '+140 Max Energy Shield',
  '+(150-400) Max Life',
  '+(40–60) Max Mana',
  '+(5–10)% Fire Resistance',
  '+(20–25)% Cold Resistance',
  '+(32–40)% Critical Strike Rating',
  '+25% Critical Strike Damage',
  '+15% Attack Speed',
  '+20% Cast Speed',
  '+8–10)% Movement Speed',
  '+54–74 Armor',
  '+(87–117) Evasion',
];

console.log('=== Testing Affix Translations ===\n');

testCases.forEach(testCase => {
  const translated = getTranslatedAffixText(testCase);
  console.log(`EN: ${testCase.padEnd(50)} → CN: ${translated}`);
});

console.log('\n=== Test Complete ===');
