const m = require('../src/locales/zh/common.js');

const selectAffixTranslations = Object.entries(m.messages)
  .filter(([k]) => k.includes('Select') && k.includes('affix'));

console.log('=== Select Affix Translations ===\n');

selectAffixTranslations.forEach(([k, v]) => {
  console.log(`"${k}": ${JSON.stringify(v)}`);
});
