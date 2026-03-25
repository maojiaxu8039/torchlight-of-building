import { getTranslatedAffixText } from '../src/lib/affix-translator.ts';

const testCases = [
  '+140 Max Energy Shield',
  '+110 Max Life',
  '+80 Max Energy Shield',
  '+95 Max Life',
  '+65 Max Life',
  '+50 Max Energy Shield',
  '+35 Max Life',
];

console.log('=== Testing Dropdown Affix Translations ===\n');

testCases.forEach(testCase => {
  const translated = getTranslatedAffixText(testCase);
  const hasTranslation = translated !== testCase;
  console.log(`${hasTranslation ? '✅' : '⚠️'} ${testCase.padEnd(35)} → ${translated}`);
});
