const fs = require('fs');
const path = require('path');

const poFile = path.join(__dirname, '../src/locales/zh/common.po');
let content = fs.readFileSync(poFile, 'utf8');

// Find <Select {affixType}> and add explicit-id marker before it
const target = 'msgid "<Select {affixType}>"';
const marker = '#. js-lingui-explicit-id';

if (content.includes(target)) {
  // Find the position of the target
  const idx = content.indexOf(target);
  // Find what comes before
  const before = content.substring(0, idx);

  // Find the last # before this
  const lastHashIdx = before.lastIndexOf('#');

  if (lastHashIdx !== -1) {
    const beforeHash = before.substring(0, lastHashIdx);
    const afterHash = content.substring(lastHashIdx);

    // Check if this already has explicit-id
    if (!afterHash.startsWith(marker)) {
      content = beforeHash + marker + '\n' + afterHash;
      console.log('✓ Added explicit-id marker to <Select {affixType}>');
    } else {
      console.log('✓ <Select {affixType}> already has explicit-id marker');
    }
  } else {
    console.log('⚠ Could not find # before <Select {affixType}>');
  }
} else {
  console.log('⚠ Could not find <Select {affixType}> in PO file');
}

fs.writeFileSync(poFile, content, 'utf8');
console.log('\nDone! Please run "pnpm lingui:compile" to update.');
