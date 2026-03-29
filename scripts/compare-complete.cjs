const fs = require("fs");
const path = require("path");

const scriptsDir = __dirname;
const projectDir = path.join(scriptsDir, "..");

const scrapedTranslations = JSON.parse(
  fs.readFileSync(
    path.join(scriptsDir, "scraped-translations-complete.json"),
    "utf-8",
  ),
);
const missingAffixes = JSON.parse(
  fs.readFileSync(
    path.join(projectDir, "src/data/translated-affixes/missing-affixes.json"),
    "utf-8",
  ),
);

console.log("🔍 Comparing complete scrape with missing-affixes.json\n");

console.log(`Scraped translations: ${Object.keys(scrapedTranslations).length}`);
console.log(`Missing affixes: ${missingAffixes.length}`);

const foundInScraped = [];
const notFound = [];

missingAffixes.forEach((affix) => {
  if (scrapedTranslations[affix]) {
    foundInScraped.push({ en: affix, cn: scrapedTranslations[affix] });
  } else {
    notFound.push(affix);
  }
});

console.log(`\n✅ Found in scraped: ${foundInScraped.length}`);
console.log(`❌ NOT found in scraped: ${notFound.length}`);

console.log("\n" + "=".repeat(60));
console.log("\n📋 NOT found entries (first 80):");
notFound.slice(0, 80).forEach((affix) => {
  console.log(`   ${affix}`);
});

if (notFound.length > 80) {
  console.log(`   ... and ${notFound.length - 80} more`);
}

const output = { foundInScraped, notFound };

fs.writeFileSync(
  path.join(scriptsDir, "translation-comparison-complete.json"),
  JSON.stringify(output, null, 2),
  "utf-8",
);
console.log(`\n✅ Saved to translation-comparison-complete.json`);
