import * as fs from 'fs';
import * as path from 'path';

const filesToUpdate = [
  {
    path: '/Users/mc/.openclaw/workspace/torchlight-of-building/src/components/talents/TalentNodeDisplay.tsx',
    patterns: [
      { from: /{affix\.text}/g, to: '{getTranslatedAffixText(affix.text)}' }
    ]
  },
  {
    path: '/Users/mc/.openclaw/workspace/torchlight-of-building/src/components/talents/PrismInventoryItem.tsx',
    patterns: [
      { from: /{areaAffix\.text}/g, to: '{getTranslatedAffixText(areaAffix.text)}' },
      { from: /{affix\.text}/g, to: '{getTranslatedAffixText(affix.text)}' }
    ]
  },
  {
    path: '/Users/mc/.openclaw/workspace/torchlight-of-building/src/components/skills/SupportSkillSelectedTooltipContent.tsx',
    patterns: [
      { from: /{affix\.text}/g, to: '{getTranslatedAffixText(affix.text)}' }
    ]
  },
  {
    path: '/Users/mc/.openclaw/workspace/torchlight-of-building/src/components/equipment/VoraxGearModule.tsx',
    patterns: [
      { from: /{slot\.text}/g, to: '{getTranslatedAffixText(slot.text)}' }
    ]
  },
  {
    path: '/Users/mc/.openclaw/workspace/torchlight-of-building/src/components/DebugPanel.tsx',
    patterns: [
      { from: /{affix\.text}/g, to: '{getTranslatedAffixText(affix.text)}' },
      { from: /{line\.text}/g, to: '{getTranslatedAffixText(line.text)}' }
    ]
  }
];

const importStatement = 'import { getTranslatedAffixText } from "@/src/lib/affix-translator";\n';

filesToUpdate.forEach(({ path: filePath, patterns }) => {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  if (!content.includes('getTranslatedAffixText')) {
    const lines = content.split('\n');
    const importIndex = lines.findIndex(line => line.startsWith('import'));
    if (importIndex !== -1) {
      lines.splice(importIndex, 0, importStatement);
      content = lines.join('\n');
      hasChanges = true;
    }
  }

  patterns.forEach(({ from, to }) => {
    const updatedContent = content.replace(from, to);
    if (updatedContent !== content) {
      content = updatedContent;
      hasChanges = true;
    }
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${path.basename(filePath)}`);
  } else {
    console.log(`⏭️  No changes: ${path.basename(filePath)}`);
  }
});

console.log('\n🎉 Comprehensive translation update completed!');
