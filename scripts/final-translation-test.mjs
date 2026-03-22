import { getBaseGearNameTranslation } from '../src/data/translated-affixes/base-gear-name-translations.ts';

const testCases = [
  'Boots of Calamity',
  'Elder Sage Girdle',
  'Dragon Scale Shoes',
  'Arcanist Girdle',
  'Wayfarer Waistguard',
  'Steel\'s Lament',
  'Assassin\'s Pendant',
  'Lone Walker\'s Boots',
  'Grace Boots',
  'Rogue\'s Long Boots',
];

console.log('=== Testing Complete Base Gear Name Translations ===\n');

testCases.forEach(testCase => {
  const translated = getBaseGearNameTranslation(testCase);
  const hasTranslation = translated !== testCase;
  console.log(`${hasTranslation ? '✅' : '⚠️'} ${testCase.padEnd(35)} → ${translated}`);
});

console.log('\n=== Test Complete ===');
