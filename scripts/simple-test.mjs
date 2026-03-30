import { getGearAffixes } from "../src/tli/calcs/affix-collectors.ts";
import { getTranslatedAffixText } from "../src/lib/affix-translator.ts";
import { ALL_BASE_GEAR } from "../src/data/gear-base/all-base-gear.ts";

console.log("=== Testing Gear Affixes ===\n");

const beltGears = ALL_BASE_GEAR.filter((g) => g.equipmentType === "Belt");
console.log(`Found ${beltGears.length} Belt items\n`);

const elderSage = beltGears.find((g) => g.baseGearName === "Elder Sage Girdle");

if (elderSage) {
  console.log("Found Elder Sage Girdle:");
  console.log("  baseGearName:", elderSage.baseGearName);
  console.log("  baseStats exists:", !!elderSage.baseStats);

  if (elderSage.baseStats?.baseStatLines) {
    console.log(
      "  baseStatLines count:",
      elderSage.baseStats.baseStatLines.length,
    );
    elderSage.baseStats.baseStatLines.forEach((line, i) => {
      console.log(`    Line ${i}:`, line.text);
    });
  }

  const affixes = getGearAffixes(elderSage);
  console.log("\n  getGearAffixes result:", affixes.length, "affixes");

  if (affixes.length > 0) {
    console.log("  First affix lines:");
    affixes[0].affixLines.forEach((line, i) => {
      const translated = getTranslatedAffixText(line.text);
      console.log(`    Line ${i}: "${line.text}" → "${translated}"`);
    });
  }
} else {
  console.log("Elder Sage Girdle not found!");
  console.log("\nAvailable Belt items:");
  beltGears.slice(0, 5).forEach((g) => {
    console.log("  -", g.baseGearName);
  });
}
