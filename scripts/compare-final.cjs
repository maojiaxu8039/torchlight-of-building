const fs = require("fs");
const path = require("path");

const scriptsDir = __dirname;
const projectDir = path.join(scriptsDir, "..");

const scrapedTranslations = JSON.parse(
  fs.readFileSync(
    path.join(scriptsDir, "scraped-translations-final.json"),
    "utf-8",
  ),
);
const missingAffixes = JSON.parse(
  fs.readFileSync(
    path.join(projectDir, "src/data/translated-affixes/missing-affixes.json"),
    "utf-8",
  ),
);

console.log("🔍 Final comparison: scraped vs missing-affixes.json\n");

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
console.log(`❌ NOT found: ${notFound.length}`);
console.log(
  `📈 Coverage: ${((foundInScraped.length / missingAffixes.length) * 100).toFixed(1)}%`,
);

console.log("\n" + "=".repeat(60));
console.log("\n📋 NOT found entries (first 50):");
notFound.slice(0, 50).forEach((affix) => {
  console.log(`   ${affix}`);
});

if (notFound.length > 50) {
  console.log(`   ... and ${notFound.length - 50} more`);
}

const output = {
  foundInScraped,
  notFound,
  stats: {
    totalScraped: Object.keys(scrapedTranslations).length,
    totalMissing: missingAffixes.length,
    found: foundInScraped.length,
    notFound: notFound.length,
    coverage:
      ((foundInScraped.length / missingAffixes.length) * 100).toFixed(1) + "%",
  },
};

fs.writeFileSync(
  path.join(scriptsDir, "translation-comparison-final.json"),
  JSON.stringify(output, null, 2),
  "utf-8",
);
console.log(`\n✅ Saved to translation-comparison-final.json`);
