import { getTranslatedAffixText } from "../src/lib/affix-translator.ts";

const testCases = [
  "Reaps 0.16 s of Damage Over Time when inflicting Trauma. The effect has a 1 s Recovery Time against the same target",
  "Reaps 0.25 s of Damage Over Time when inflicting Ignite. The effect has a 1 s Recovery Time against the same target",
  "Reaps 0.12 s of Damage Over Time when inflicting Wilt. The effect has a 1 s Recovery Time against the same target",
  "Reaps 0.5 s of Damage Over Time from Nearby enemies within 10 m that have full Affliction. The effect has a 2 s Recovery Time against the same target",
  "+10% Damage Over Time",
  "+15% Critical Strike Rating",
  "+20 Max Energy Shield",
];

console.log("=== Testing Damage Over Time Translations ===\n");

testCases.forEach((testCase) => {
  const translated = getTranslatedAffixText(testCase);
  console.log(`EN: ${testCase.substring(0, 60).padEnd(60)}`);
  console.log(`CN: ${translated}`);
  console.log("─".repeat(80));
});
