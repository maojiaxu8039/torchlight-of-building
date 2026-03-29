const fs = require("fs");
const path = require("path");
const glob = require("glob");

const scriptsDir = __dirname;
const projectDir = path.join(scriptsDir, "..");

const scrapedTranslations = JSON.parse(
  fs.readFileSync(path.join(scriptsDir, "scraped-translations.json"), "utf-8"),
);

console.log("🔍 Comparing scraped translations with gear-affix/*.ts\n");

const scrapedKeys = new Set(Object.keys(scrapedTranslations));

const gearFiles = glob.sync(path.join(projectDir, "src/data/gear-affix/*.ts"));
console.log(`Found ${gearFiles.length} gear-affix files\n`);

let totalAffixes = 0;
let foundInScraped = 0;
const notFound = [];

gearFiles.forEach((file) => {
  const content = fs.readFileSync(file, "utf-8");

  const craftableAffixMatches =
    content.match(/craftableAffix:\s*"([^"]+)"/g) || [];

  craftableAffixMatches.forEach((match) => {
    const affix = match.match(/craftableAffix:\s*"([^"]+)"/)[1];
    totalAffixes++;

    if (scrapedKeys.has(affix)) {
      foundInScraped++;
    } else {
      notFound.push(affix);
    }
  });
});

console.log("=".repeat(60));
console.log("\n📊 Comparison Results:");
console.log(`   Total affixes in gear-affix/*.ts: ${totalAffixes}`);
console.log(`   Found in scraped translations: ${foundInScraped}`);
console.log(`   NOT found in scraped: ${notFound.length}`);
console.log(
  `   Coverage: ${((foundInScraped / totalAffixes) * 100).toFixed(1)}%`,
);

console.log("\n" + "=".repeat(60));
console.log("\n📋 NOT found affixes (first 50):");
notFound.slice(0, 50).forEach((affix) => {
  console.log(`   ${affix}`);
});

if (notFound.length > 50) {
  console.log(`   ... and ${notFound.length - 50} more`);
}

fs.writeFileSync(
  path.join(scriptsDir, "missing-from-scraped.json"),
  JSON.stringify(notFound, null, 2),
  "utf-8",
);
console.log(`\n✅ Saved missing affixes to missing-from-scraped.json`);
