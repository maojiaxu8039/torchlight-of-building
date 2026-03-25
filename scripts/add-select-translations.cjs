const fs = require('fs');
const path = require('path');

const poFile = path.join(__dirname, '../src/locales/zh/common.po');
let content = fs.readFileSync(poFile, 'utf8');

// Add translations for Select options
const translations = [
  { msgid: '<Select Base Affix>', msgstr: '<选择基础词缀>' },
  { msgid: '<Select Sweet Dream Affix>', msgstr: '<选择甜蜜梦境词缀>' },
  { msgid: '<Select Tower Sequence>', msgstr: '<选择高塔序列>' },
  { msgid: '<Select Blend>', msgstr: '<选择混合词缀>' },
  { msgid: '<Select Prefix>', msgstr: '<选择前缀>' },
  { msgid: '<Select Suffix>', msgstr: '<选择后缀>' },
];

translations.forEach(({ msgid, msgstr }) => {
  if (!content.includes(`msgid "${msgid}"`)) {
    // Find the position to insert (after <Select Base Stats>)
    const insertAfter = 'msgstr "<选择基底词缀>"';
    const idx = content.indexOf(insertAfter);

    if (idx !== -1) {
      const insertContent = `\n\n#. js-lingui-explicit-id\n#: src/components/equipment\nmsgid "${msgid}"\nmsgstr "${msgstr}"`;
      content = content.slice(0, idx + insertAfter.length) + insertContent + content.slice(idx + insertAfter.length);
      console.log(`✓ Added: ${msgid} → ${msgstr}`);
    } else {
      console.log(`⚠ Could not find insert position for ${msgid}`);
    }
  } else {
    console.log(`✓ Already exists: ${msgid}`);
  }
});

fs.writeFileSync(poFile, content, 'utf8');
console.log('\nDone! Please run "pnpm lingui:compile" to update.');
