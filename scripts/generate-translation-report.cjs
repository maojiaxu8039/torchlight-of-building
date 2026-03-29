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

console.log("📊 生成完整翻译对照表报告...\n");

const foundInScraped = [];
const notFound = [];

missingAffixes.forEach((affix) => {
  if (scrapedTranslations[affix]) {
    foundInScraped.push({ en: affix, cn: scrapedTranslations[affix] });
  } else {
    notFound.push(affix);
  }
});

const coveredTranslations = Object.keys(scrapedTranslations).map((en) => ({
  en: en,
  cn: scrapedTranslations[en],
}));

let mdContent = `# 词缀翻译对照表报告

生成时间: ${new Date().toISOString()}

## 📊 统计概览

| 项目 | 数量 |
|------|------|
| 抓取到的翻译总数 | ${Object.keys(scrapedTranslations).length} |
| missing-affixes.json 总数 | ${missingAffixes.length} |
| **已覆盖** | ${foundInScraped.length} |
| **未覆盖** | ${notFound.length} |
| 覆盖率 | ${((foundInScraped.length / missingAffixes.length) * 100).toFixed(1)}% |

---

## ✅ 已覆盖的词缀 (${foundInScraped.length} 条)

以下词缀在抓取数据中找到了对应的中文翻译：

| # | 英文 | 中文 |
|---|------|------|
${foundInScraped.map((item, idx) => `| ${idx + 1} | ${item.en.replace(/\|/g, "\\|").replace(/\n/g, "<br>")} | ${item.cn.replace(/\|/g, "\\|").replace(/\n/g, "<br>")} |`).join("\n")}

---

## ❌ 未覆盖的词缀 (${notFound.length} 条)

以下词缀在抓取数据中未找到对应翻译（可能需要手动翻译或检查网站数据）：

| # | 英文词缀 |
|---|---------|
${notFound.map((item, idx) => `| ${idx + 1} | ${item.replace(/\|/g, "\\|").replace(/\n/g, "<br>")} |`).join("\n")}

---

## 📋 未覆盖词缀分类统计

`;

const categorized = {};
notFound.forEach((affix) => {
  const lower = affix.toLowerCase();
  let category = "Other";

  if (/max life/i.test(affix)) category = "Max Life";
  else if (/max mana/i.test(affix)) category = "Max Mana";
  else if (/max energy shield/i.test(affix)) category = "Max Energy Shield";
  else if (/resistance/i.test(affix)) category = "Resistance";
  else if (/movement speed/i.test(affix)) category = "Movement Speed";
  else if (/cooldown/i.test(affix)) category = "Cooldown";
  else if (/skill effect duration/i.test(affix)) category = "Skill Duration";
  else if (/sealed mana/i.test(affix)) category = "Sealed Mana";
  else if (/aura/i.test(affix)) category = "Aura Effect";
  else if (/immune/i.test(affix)) category = "Immunity";
  else if (/max elemental/i.test(affix)) category = "Max Elemental Resistance";
  else if (/restoration/i.test(affix)) category = "Restoration";
  else if (/block chance/i.test(affix)) category = "Block Chance";
  else if (/damage/i.test(affix)) category = "Damage";
  else if (/minion/i.test(affix)) category = "Minion";
  else if (/critical/i.test(affix)) category = "Critical";
  else if (/\bstrength\b/i.test(affix)) category = "Strength";
  else if (/dexterity/i.test(affix)) category = "Dexterity";
  else if (/intelligence/i.test(affix)) category = "Intelligence";
  else if (/defense/i.test(affix)) category = "Defense";
  else if (/evasion/i.test(affix)) category = "Evasion";
  else if (/armor/i.test(affix)) category = "Armor";
  else if (/ailment/i.test(affix)) category = "Ailment";
  else if (/duration/i.test(affix)) category = "Duration";
  else if (/penetration/i.test(affix)) category = "Penetration";
  else if (/projectile/i.test(affix)) category = "Projectile";
  else if (/barrage/i.test(affix)) category = "Barrage";
  else if (/curse/i.test(affix)) category = "Curse";
  else if (/channel/i.test(affix)) category = "Channeling";
  else if (/ignite/i.test(affix)) category = "Ignite";
  else if (/trauma/i.test(affix)) category = "Trauma";
  else if (/wilt/i.test(affix)) category = "Wilt";
  else if (/deterioration/i.test(affix)) category = "Deterioration";
  else if (/infiltration/i.test(affix)) category = "Infiltration";
  else if (/affliction/i.test(affix)) category = "Affliction";
  else if (/reap/i.test(affix)) category = "Reap";
  else if (/spirit/i.test(affix)) category = "Spirit";
  else if (/fortitude/i.test(affix)) category = "Fortitude";
  else if (/blessing/i.test(affix)) category = "Blessing";
  else if (/stack/i.test(affix)) category = "Stacks";
  else if (/charged/i.test(affix)) category = "Charged";
  else if (/spell burst/i.test(affix)) category = "Spell Burst";
  else if (/combo/i.test(affix)) category = "Combo";
  else if (/regenerat/i.test(affix)) category = "Regeneration";
  else if (/energy shield/i.test(affix)) category = "Energy Shield";

  if (!categorized[category]) {
    categorized[category] = [];
  }
  categorized[category].push(affix);
});

const sortedCategories = Object.keys(categorized).sort(
  (a, b) => categorized[b].length - categorized[a].length,
);

sortedCategories.forEach((cat) => {
  mdContent += `### ${cat} (${categorized[cat].length})\n\n`;
  categorized[cat].forEach((affix) => {
    mdContent += `- \`${affix.replace(/\|/g, "\\|").replace(/\n/g, " ")}\`\n`;
  });
  mdContent += `\n`;
});

fs.writeFileSync(
  path.join(scriptsDir, "translation-report.md"),
  mdContent,
  "utf-8",
);
console.log(`✅ 生成翻译报告: translation-report.md`);

const jsonReport = {
  stats: {
    totalScraped: Object.keys(scrapedTranslations).length,
    totalMissing: missingAffixes.length,
    covered: foundInScraped.length,
    notCovered: notFound.length,
    coverage: `${((foundInScraped.length / missingAffixes.length) * 100).toFixed(1)}%`,
  },
  covered: foundInScraped,
  notCovered: notFound,
  categorized: categorized,
};

fs.writeFileSync(
  path.join(scriptsDir, "translation-report.json"),
  JSON.stringify(jsonReport, null, 2),
  "utf-8",
);
console.log(`✅ 生成 JSON 报告: translation-report.json`);

console.log("\n📊 分类统计:");
sortedCategories.slice(0, 20).forEach((cat) => {
  console.log(`  ${cat}: ${categorized[cat].length}`);
});
