const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

let added = 0;

// Aura Effect
for (let i = 1; i <= 100; i++) {
  const en = "+" + i + "% Aura Effect";
  if (!translations[en]) {
    translations[en] = "+" + i + "% 光环效果";
    added++;
  }
}

// Attack and Spell Critical Strike Rating
for (let i = 50; i <= 300; i++) {
  const en = "+" + i + " Attack and Spell Critical Strike Rating";
  if (!translations[en]) {
    translations[en] = "+" + i + " 攻击和法术暴击值";
    added++;
  }
}

// Regenerates X% Life per second when taking Damage Over Time
for (let i = 1; i <= 20; i++) {
  const en =
    "Regenerates " + i + "% Life per second when taking Damage Over Time";
  if (!translations[en]) {
    translations[en] = "受到持续伤害时，每秒回复 " + i + "% 生命";
    added++;
  }
}

const sorted = Object.entries(translations).sort(
  (a, b) => b[0].length - a[0].length,
);
const result = {};
sorted.forEach((e) => {
  result[e[0]] = e[1];
});
fs.writeFileSync(
  "src/data/translated-affixes/merged-all-translations.json",
  JSON.stringify(result, null, 2),
);

console.log("新增翻译:", added);
console.log("总计:", Object.keys(result).length, "条");
