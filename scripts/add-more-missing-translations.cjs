const fs = require('fs');
const path = require('path');

const file = '/Users/mc/.openclaw/workspace/torchlight-of-building/src/data/translated-affixes/complete-affix-translations.ts';
let content = fs.readFileSync(file, 'utf8');

const missingTranslations = {
  'Restoration Skills gain Charging Progress every second': '回复技能每秒获得充能进度',
  'Restoration Skills gain . Charging Progress every second': '回复技能每秒获得 充能进度',
  '% Aura Effect': '% 光环效果',
  '+(%) Aura Effect': '+(%) 光环效果',
  '% Sealed Mana Compensation': '% 魔力封印补偿',
  'Sealed Mana Compensation': '魔力封印补偿',
  'Charging Progress': '充能进度',
  'Aura Effect': '光环效果',
  'every second': '每秒',
};

console.log('Adding more missing translations...\n');

Object.entries(missingTranslations).forEach(([en, cn]) => {
  const escapedEn = en.replace(/'/g, "\\'");
  const escapedCn = cn.replace(/'/g, "\\'");

  if (!content.includes(`'${escapedEn}':`)) {
    const entry = `\n  '${escapedEn}': '${escapedCn}',`;
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
console.log('\n✓ Done!');
