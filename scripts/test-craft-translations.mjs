import { getTranslatedAffixText } from '../src/lib/affix-translator.ts';

const testCases = [
  'Reaps 0.16 s of Damage Over Time when inflicting Trauma. The effect has a 1 s Recovery Time against the same target',
  'Reaps 0.25 s of Damage Over Time when inflicting Ignite. The effect has a 1 s Recovery Time against the same target',
  'Damage Penetrates (5–8)% Elemental Resistance',
  'Adds (36–38) - (44–46) Physical Damage to the gear',
  '+1 to Max Agility Blessing Stacks',
  '+1 to Max Focus Blessing Stacks',
  '+140 Max Energy Shield',
  '+(150–400) Max Life',
  '+(5–10)% Fire Resistance',
  '+25% Critical Strike Rating',
];

console.log('=== Testing Complete Craft Affix Translations ===\n');

testCases.forEach(testCase => {
  const translated = getTranslatedAffixText(testCase);
  const hasTranslation = translated !== testCase;
  console.log(`${hasTranslation ? '✅' : '⚠️'} ${testCase.substring(0, 70).padEnd(70)}`);
  if (hasTranslation) {
    console.log(`   → ${translated}`);
  }
  console.log('');
});
