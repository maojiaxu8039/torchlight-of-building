const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "../src/data/translated-affixes");

// 加载所有翻译
const translations = {};
const files = fs
  .readdirSync(outDir)
  .filter((f) => f.endsWith("-translations.json") && !f.startsWith("complete"));

files.forEach((file) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(outDir, file), "utf8"));

    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (item.enText && item.cnText) {
          translations[item.enText] = item.cnText;
        }
      });
    } else {
      Object.entries(data).forEach(([en, cn]) => {
        if (typeof cn === "string") {
          translations[en] = cn;
        }
      });
    }
  } catch (e) {
    // ignore
  }
});

// 添加缺失的翻译
const missingTranslations = {
  // Max Energy Shield variants
  "+140 Max Energy Shield": "+140 最大护盾",
  "+110 Max Energy Shield": "+110 最大护盾",
  "+80 Max Energy Shield": "+80 最大护盾",
  "+50 Max Energy Shield": "+50 最大护盾",
  "+35 Max Energy Shield": "+35 最大护盾",
  "+18 Max Energy Shield": "+18 最大护盾",
  "+140 Energy Shield": "+140 护盾",

  // Max Life variants
  "+140 Max Life": "+140 最大生命",
  "+110 Max Life": "+110 最大生命",
  "+95 Max Life": "+95 最大生命",
  "+65 Max Life": "+65 最大生命",
  "+35 Max Life": "+35 最大生命",

  // Max Mana variants
  "+140 Max Mana": "+140 最大魔力",
  "+110 Max Mana": "+110 最大魔力",
  "+80 Max Mana": "+80 最大魔力",
  "+50 Max Mana": "+50 最大魔力",

  // 基础属性
  "Max Energy Shield": "最大护盾",
  "Max Life": "最大生命",
  "Max Mana": "最大魔力",

  // 装备名称组合
  "Elder Sage Girdle - +140 Max Energy Shield": "大贤者束带 - +140 最大护盾",
  "Wayfarer Waistguard - +110 Max Life": "游荡者护腰 - +110 最大生命",
  "Arcanist Girdle - +110 Max Energy Shield": "秘术师束带 - +110 最大护盾",
  "Conqueror Waistguard - +95 Max Life": "征服者护腰 - +95 最大生命",
  "Magic Girdle - +80 Max Energy Shield": "魔法束带 - +80 最大护盾",
  "Fearless Waistguard - +65 Max Life": "无畏护腰 - +65 最大生命",
  "Radiant Lunar Girdle - +50 Max Energy Shield": "光辉月之束带 - +50 最大护盾",
  "Dragon Scale Waistguard - +35 Max Life": "龙鳞护腰 - +35 最大生命",
  "God's Grace Girdle - +18 Max Energy Shield": "神之恩赐束带 - +18 最大护盾",
};

// 添加缺失的翻译
let added = 0;
Object.entries(missingTranslations).forEach(([en, cn]) => {
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log(`✅ Added ${added} missing translations`);

// 排序（优先匹配长的）
const sorted = Object.entries(translations).sort(
  (a, b) => b[0].length - a[0].length,
);
const sortedTranslations = {};
sorted.forEach(([en, cn]) => {
  sortedTranslations[en] = cn;
});

// 保存到合并文件
fs.writeFileSync(
  path.join(outDir, "merged-all-translations.json"),
  JSON.stringify(sortedTranslations, null, 2),
  "utf-8",
);

console.log(`✅ Total translations: ${Object.keys(sortedTranslations).length}`);
