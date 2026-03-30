import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, "../src/components");

const filesToCheck = [
  "equipment/EditGearModal.tsx",
  "equipment/EquipmentSlotDropdown.tsx",
  "equipment/LegendaryGearModule.tsx",
  "equipment/VoraxGearModule.tsx",
  "equipment/GroupedAffixSlotComponent.tsx",
  "equipment/AffixSlotComponent.tsx",
  "hero/TraitSelector.tsx",
  "hero/EditMemoryModal.tsx",
  "talents/PrismCrafter.tsx",
  "pactspirit/PactspiritColumn.tsx",
  "pactspirit/UndeterminedFateSection.tsx",
  "divinity/SlateCrafter.tsx",
  "divinity/LegendarySlateCrafter.tsx",
  "skills/SupportSkillSelector.tsx",
  "skills/SpecialSupportEditModal.tsx",
  "skills/SkillSlot.tsx",
  "skills/ActivationMediumEditModal.tsx",
  "modals/DestinySelectionModal.tsx",
  "calculations/SkillSelector.tsx",
];

console.log("=== Checking and Adding Translations to Dropdowns ===\n");

const importStatement =
  'import { getBaseGearNameTranslation } from "@/src/data/translated-affixes/base-gear-name-translations";\nimport { getTranslatedAffixText } from "@/src/lib/affix-translator";\n';

filesToCheck.forEach((file) => {
  const filePath = path.join(componentsDir, file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");

  const hasTranslationImport =
    content.includes("getBaseGearNameTranslation") ||
    content.includes("getTranslatedAffixText");

  if (!hasTranslationImport) {
    const lines = content.split("\n");
    const importIndex = lines.findIndex((line) => line.startsWith("import"));

    if (importIndex !== -1) {
      lines.splice(importIndex, 0, importStatement);
      fs.writeFileSync(filePath, lines.join("\n"), "utf8");
      console.log(`✅ Added imports to: ${file}`);
    }
  } else {
    console.log(`✓  Already has translations: ${file}`);
  }
});

console.log("\n=== Check Complete ===");
console.log(
  "\nPlease review each file and manually add translation functions where needed.",
);
console.log("Common patterns to translate:");
console.log("  - gear.name → getBaseGearNameTranslation(gear.name)");
console.log("  - gear.stats → getTranslatedAffixText(gear.stats)");
console.log(
  "  - `${name} — ${stats}` → `${getBaseGearNameTranslation(name)} — ${getTranslatedAffixText(stats)}`",
);
