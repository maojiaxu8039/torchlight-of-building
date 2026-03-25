const fs = require('fs');
const path = require('path');

const poFile = path.join(__dirname, '../src/locales/zh/common.po');

let content = fs.readFileSync(poFile, 'utf8');

const translations = [
  {
    msgid: '<Select Base Stats>',
    msgstr: '<选择基底词缀>',
    comment: 'src/components/equipment/EditGearModal.tsx:754'
  },
  {
    msgid: '<Select {affixType}>',
    msgstr: '<选择 {affixType}>',
    comment: 'src/components/equipment/AffixSlotComponent.tsx'
  },
  {
    msgid: '<Select Pactspirit>',
    msgstr: '<选择契约之灵>',
    comment: 'src/components/pactspirit/PactspiritColumn.tsx:95'
  },
  {
    msgid: '<Select Destiny>',
    msgstr: '<选择命运>',
    comment: 'src/components/modals/DestinySelectionModal.tsx'
  },
  {
    msgid: 'Select an active skill...',
    msgstr: '选择主动技能...',
    comment: 'src/components/calculations/SkillSelector.tsx'
  },
  {
    msgid: 'Select base affix...',
    msgstr: '选择基础词缀...',
    comment: 'src/components/talents/PrismCrafter.tsx'
  },
  {
    msgid: 'Select area expansion...',
    msgstr: '选择范围扩展...',
    comment: 'src/components/talents/PrismCrafter.tsx'
  },
  {
    msgid: 'Select affix...',
    msgstr: '选择词缀...',
    comment: 'src/components/divinity/SlateCrafter.tsx'
  },
  {
    msgid: 'Select a legendary...',
    msgstr: '选择传奇装备...',
    comment: 'src/components/equipment/LegendaryGearModule.tsx'
  },
  {
    msgid: 'Select a blend...',
    msgstr: '选择混合词缀...',
    comment: 'src/components/equipment/LegendaryGearModule.tsx'
  },
  {
    msgid: 'Select equipment type...',
    msgstr: '选择装备类型...',
    comment: 'src/components/equipment/EditGearModal.tsx'
  },
  {
    msgid: 'Select memory type...',
    msgstr: '选择记忆类型...',
    comment: 'src/components/hero/EditMemoryModal.tsx'
  },
  {
    msgid: 'Select rarity...',
    msgstr: '选择稀有度...',
    comment: 'src/components/hero/EditMemoryModal.tsx'
  },
  {
    msgid: 'Select level...',
    msgstr: '选择等级...',
    comment: 'src/components/hero/EditMemoryModal.tsx'
  },
  {
    msgid: 'Select base stat...',
    msgstr: '选择基础属性...',
    comment: 'src/components/hero/EditMemoryModal.tsx'
  },
  {
    msgid: 'Select legendary...',
    msgstr: '选择传奇...',
    comment: 'src/components/equipment/VoraxGearModule.tsx'
  },
  {
    msgid: 'Select tier',
    msgstr: '选择等级',
    comment: 'src/components/skills/SpecialSupportEditModal.tsx'
  },
  {
    msgid: 'Select rank',
    msgstr: '选择等级',
    comment: 'src/components/skills/SpecialSupportEditModal.tsx'
  },
  {
    msgid: 'Select option',
    msgstr: '选择选项',
    comment: 'src/components/skills/ActivationMediumEditModal.tsx'
  },
  {
    msgid: 'Select a hero...',
    msgstr: '选择英雄...',
    comment: 'src/components/hero/HeroSelector.tsx'
  },
];

console.log('Adding placeholder translations to common.po...\n');

translations.forEach(({ msgid, msgstr, comment }) => {
  const escapedMsgid = msgid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedMsgstr = msgstr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const regex = new RegExp(`msgid\\s+"${escapedMsgid.replace(/%/g, '%%').replace(/\\{/g, '\\\\{').replace(/\\}/g, '\\\\}')}"`, 'g');

  if (content.includes(msgid)) {
    console.log(`✓ Already exists: ${msgid}`);
  } else {
    const entry = `\n#. js-lingui-explicit-id\n#: ${comment}\nmsgid "${msgid}"\nmsgstr "${msgstr}"\n`;

    const insertIndex = content.lastIndexOf('msgstr ""');
    if (insertIndex !== -1) {
      content = content.slice(0, insertIndex) + entry + content.slice(insertIndex);
      console.log(`✓ Added: ${msgid} → ${msgstr}`);
    }
  }
});

fs.writeFileSync(poFile, content, 'utf8');
console.log('\nDone! Please run "pnpm lingui:compile" to update the compiled translations.');
