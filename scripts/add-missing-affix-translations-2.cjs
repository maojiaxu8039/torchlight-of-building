const fs = require('fs');
const path = require('path');

const file = '/Users/mc/.openclaw/workspace/torchlight-of-building/src/data/translated-affixes/complete-affix-translations.ts';
let content = fs.readFileSync(file, 'utf8');

const missingTranslations = {
  'Gains stack(s) of all Blessings when casting a Restoration Skill': '施放回复技能时获得所有祝福层数',
  'Restoration Skills gain 1. Charging Progress every second': '回复技能每秒获得 1 充能进度',
  'Restoration Skills gain 2. Charging Progress every second': '回复技能每秒获得 2 充能进度',
  'Restoration Skills gain 3. Charging Progress every second': '回复技能每秒获得 3 充能进度',
  'Restoration Skills gain 4. Charging Progress every second': '回复技能每秒获得 4 充能进度',
  'Immune to SlowImmune to Weaken': '免疫减速免疫虚弱',
  'Immune to ParalysisImmune to Blinding': '免疫麻痹免疫致盲',
  'Immune to Slow Immune to Weaken': '免疫减速免疫虚弱',
  'Immune to Paralysis Immune to Blinding': '免疫麻痹免疫致盲',
  'Immune to Slow': '免疫减速',
  'Immune to Weaken': '免疫虚弱',
  'Immune to Paralysis': '免疫麻痹',
  'Immune to Blinding': '免疫致盲',
  'Restoration Skill': '回复技能',
  'Charging Progress': '充能进度',
  'every second': '每秒',
  'all Blessings': '所有祝福',
  'stack(s)': '层',
};

console.log('Adding missing translations...\n');

Object.entries(missingTranslations).forEach(([en, cn]) => {
  if (!content.includes(`'${en}':`)) {
    const entry = `\n  '${en}': '${cn}',`;
    // Find a good place to insert (before the closing brace)
    const insertBefore = '\n};';
    const idx = content.lastIndexOf(insertBefore);

    if (idx !== -1) {
      content = content.slice(0, idx) + entry + content.slice(idx);
      console.log(`✓ Added: ${en} → ${cn}`);
    }
  } else {
    console.log(`✓ Already exists: ${en}`);
  }
});

fs.writeFileSync(file, content, 'utf8');
console.log('\n✓ Done! Updated complete-affix-translations.ts');
