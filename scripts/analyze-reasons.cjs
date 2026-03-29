const fs = require("fs");

console.log("=== 未匹配原因详细分析 ===\n");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const files = fs
  .readdirSync("src/data/gear-affix")
  .filter((f) => f.endsWith(".ts"));

const unmatched = [];

files.forEach((file) => {
  const content = fs.readFileSync("src/data/gear-affix/" + file, "utf8");
  const affixMatches = content.match(/craftableAffix:\s*"([^"]+)"/g);

  if (affixMatches) {
    affixMatches.forEach((m) => {
      const affix = m.match(/craftableAffix:\s*"([^"]+)"/)[1];

      if (!translations[affix]) {
        unmatched.push(affix);
      }
    });
  }
});

console.log("未匹配总数:", unmatched.length);

// 分析原因
const reasons = {
  多个异常状态组合: [],
  数值范围不同: [],
  格式差异: [],
  特殊词缀: [],
  其他: [],
};

unmatched.forEach((affix) => {
  if (affix.includes("Immune to")) {
    reasons["特殊词缀"].push(affix);
  } else if (affix.includes("Aura") && affix.match(/\d+-\d+%/)) {
    reasons["数值范围不同"].push(affix);
  } else if (affix.match(/\(\d+-\d+\)%/g) && affix.match(/\d+-\d+%[^a-z]/)) {
    reasons["数值范围不同"].push(affix);
  } else if (affix.includes("Fortitude") || affix.includes("Profane")) {
    reasons["格式差异"].push(affix);
  } else {
    reasons["其他"].push(affix);
  }
});

Object.entries(reasons).forEach((entry) => {
  const reason = entry[0];
  const items = entry[1];

  console.log("\n=== " + reason + " (" + items.length + ") ===");
  items.slice(0, 3).forEach((item) => {
    console.log("  " + item.substring(0, 80));
  });
});
