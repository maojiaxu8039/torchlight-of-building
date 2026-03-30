import * as fs from "fs";
import * as path from "path";

const filesToUpdate = [
  "/Users/mc/.openclaw/workspace/torchlight-of-building/src/components/hero/TraitSelector.tsx",
  "/Users/mc/.openclaw/workspace/torchlight-of-building/src/components/hero/EditMemoryModal.tsx",
  "/Users/mc/.openclaw/workspace/torchlight-of-building/src/components/talents/TalentNodeDisplay.tsx",
  "/Users/mc/.openclaw/workspace/torchlight-of-building/src/components/talents/PrismCoreTalentEffect.tsx",
  "/Users/mc/.openclaw/workspace/torchlight-of-building/src/components/pactspirit/RingSlot.tsx",
  "/Users/mc/.openclaw/workspace/torchlight-of-building/src/components/pactspirit/PactspiritColumn.tsx",
  "/Users/mc/.openclaw/workspace/torchlight-of-building/src/components/hero/HeroMemoryItem.tsx",
  "/Users/mc/.openclaw/workspace/torchlight-of-building/src/components/divinity/SlateTooltipContent.tsx",
];

const importStatement =
  'import { getTranslatedAffixText } from "@/src/lib/affix-translator";\n';

const replacementPattern = /{line\.text}/g;
const replacementText = "{getTranslatedAffixText(line.text)}";

filesToUpdate.forEach((filePath) => {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");

  if (!content.includes("getTranslatedAffixText")) {
    const lines = content.split("\n");
    const importIndex = lines.findIndex((line) => line.startsWith("import"));
    if (importIndex !== -1) {
      lines.splice(importIndex, 0, importStatement);
      content = lines.join("\n");
    }
  }

  const updatedContent = content.replace(replacementPattern, replacementText);

  if (updatedContent !== content) {
    fs.writeFileSync(filePath, updatedContent, "utf8");
    console.log(`Updated: ${path.basename(filePath)}`);
  } else {
    console.log(`No changes: ${path.basename(filePath)}`);
  }
});

console.log("\nBatch update completed!");
