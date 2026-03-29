import { getTranslatedAffixText } from "../src/lib/affix-translator.ts";

const testCases = [
  "+64 Max Life",
  "+140 Max Energy Shield",
  "+(150–400) Max Life",
  "+(54–74) Max Mana",
  "+(5–10)% Fire Resistance",
  "+25% Critical Strike Rating",
  "+15% Attack Speed",
  "+20 Armor",
  "+30 Dexterity",
  "+(20–25)% Movement Speed",
];

console.log("=== Testing Basic Stat Translations ===\n");

testCases.forEach((testCase) => {
  const translated = getTranslatedAffixText(testCase);
  const hasTranslation = translated !== testCase;
  console.log(
    `${hasTranslation ? "✅" : "⚠️"} ${testCase.padEnd(35)} → ${translated}`,
  );
});
