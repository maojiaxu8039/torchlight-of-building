const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "../src/data/translated-affixes");

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, "merged-all-translations.json"), "utf8"),
);

// 添加缺失的翻译
const missingTranslations = {
  // Double Damage
  "% chance to deal Double Damage": "% 几率造成双倍伤害",
  "+% chance to deal Double Damage": "+% 几率造成双倍伤害",
  "+(%) chance to deal Double Damage": "+() 几率造成双倍伤害",
  "Deal Double Damage": "造成双倍伤害",
  "Double Damage": "双倍伤害",
  "double Damage": "双倍伤害",

  // Duration variations
  "% Duration": "% 持续时间",
  "+% Duration": "+% 持续时间",
  Duration: "持续时间",

  // Barrage Skill
  "% chance to launch one more wave when casting a Barrage Skill":
    "% 几率释放轰炸技能时额外发射一波",
  "+% chance to launch one more wave when casting a Barrage Skill":
    "+% 几率释放轰炸技能时额外发射一波",
  "+(%) chance to launch one more wave when casting a Barrage Skill":
    "+() 几率释放轰炸技能时额外发射一波",
  "launch one more wave": "额外发射一波",
  "Barrage Skill": "轰炸技能",

  // Affliction Effect
  "% Affliction Effect": "% 加剧效果",
  "+% Affliction Effect": "+% 加剧效果",
  "Affliction Effect": "加剧效果",

  // Warcry Skill
  "% Warcry is cast immediately": "% 战吼立即释放",
  "+% Warcry is cast immediately": "+% 战吼立即释放",
  "Warcry is cast immediately": "战吼立即释放",
  "Warcry Skill Charges": "战吼技能充能点数",
  "Warcry Skill": "战吼技能",

  // Elemental Resistance
  "% Elemental Resistance": "% 元素抗性",
  "+% Elemental Resistance": "+% 元素抗性",
  "Elemental Resistance": "元素抗性",
  Elemental: "元素",
  Resistance: "抗性",

  // Avoid Elemental Damage
  "% chance to avoid Elemental Damage": "% 几率躲避元素伤害",
  "+% chance to avoid Elemental Damage": "+% 几率躲避元素伤害",
  "avoid Elemental Damage": "躲避元素伤害",
  avoid: "躲避",

  // Spirit Magi Initial
  "+1 Initial Growth for Spirit Magi": "+1 魔灵初始生长值",
  "+2 Initial Growth for Spirit Magi": "+2 魔灵初始生长值",
  "+3 Initial Growth for Spirit Magi": "+3 魔灵初始生长值",
  "+4 Initial Growth for Spirit Magi": "+4 魔灵初始生长值",
  "+5 Initial Growth for Spirit Magi": "+5 魔灵初始生长值",
  "Initial Growth for Spirit Magi": "魔灵初始生长值",
  "Initial Growth": "初始生长值",
  "Spirit Magi": "魔灵",

  // Focus Speed
  "% Focus Speed": "% 贯注速度",
  "+% Focus Speed": "+% 贯注速度",
  "+(%) Focus Speed": "+() 贯注速度",
  "Focus Speed": "贯注速度",

  // Harvest Reaps - Trauma
  "+0.12 s of Damage Over Time when dealing Trauma. The effect has a 1 s Recovery Time against the same target":
    "+0.12 秒持续伤害造成创伤，该效果对同一目标有 1 秒回复时间",
  "+0.16 s of Damage Over Time when dealing Trauma. The effect has a 1 s Recovery Time against the same target":
    "+0.16 秒持续伤害造成创伤，该效果对同一目标有 1 秒回复时间",
  "+0.09 s of Damage Over Time when dealing Trauma. The effect has a 1 s Recovery Time against the same target":
    "+0.09 秒持续伤害造成创伤，该效果对同一目标有 1 秒回复时间",
  "+0.06 s of Damage Over Time when dealing Trauma. The effect has a 1 s Recovery Time against the same target":
    "+0.06 秒持续伤害造成创伤，该效果对同一目标有 1 秒回复时间",
  "dealing Trauma": "造成创伤",
  "when dealing Trauma": "造成创伤时",

  // Harvest Reaps - Ignite
  "+0.12 s of Damage Over Time when dealing Ignite. The effect has a 1 s Recovery Time against the same target":
    "+0.12 秒持续伤害造成点燃，该效果对同一目标有 1 秒回复时间",
  "+0.16 s of Damage Over Time when dealing Ignite. The effect has a 1 s Recovery Time against the same target":
    "+0.16 秒持续伤害造成点燃，该效果对同一目标有 1 秒回复时间",
  "+0.09 s of Damage Over Time when dealing Ignite. The effect has a 1 s Recovery Time against the same target":
    "+0.09 秒持续伤害造成点燃，该效果对同一目标有 1 秒回复时间",
  "+0.06 s of Damage Over Time when dealing Ignite. The effect has a 1 s Recovery Time against the same target":
    "+0.06 秒持续伤害造成点燃，该效果对同一目标有 1 秒回复时间",
  "dealing Ignite": "造成点燃",
  "when dealing Ignite": "造成点燃时",

  // Harvest Reaps - Wilt
  "+0.12 s of Damage Over Time when dealing Wilt. The effect has a 1 s Recovery Time against the same target":
    "+0.12 秒持续伤害造成萎陷，该效果对同一目标有 1 秒回复时间",
  "+0.16 s of Damage Over Time when dealing Wilt. The effect has a 1 s Recovery Time against the same target":
    "+0.16 秒持续伤害造成萎陷，该效果对同一目标有 1 秒回复时间",
  "+0.09 s of Damage Over Time when dealing Wilt. The effect has a 1 s Recovery Time against the same target":
    "+0.09 秒持续伤害造成萎陷，该效果对同一目标有 1 秒回复时间",
  "+0.06 s of Damage Over Time when dealing Wilt. The effect has a 1 s Recovery Time against the same target":
    "+0.06 秒持续伤害造成萎陷，该效果对同一目标有 1 秒回复时间",
  "dealing Wilt": "造成萎陷",
  "when dealing Wilt": "造成萎陷时",

  // generic
  "% chance": "% 几率",
  "+% chance": "+% 几率",
  "chance to": "几率",
  "to deal": "造成",
  "s of": "秒",
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

// 保存
fs.writeFileSync(
  path.join(outDir, "merged-all-translations.json"),
  JSON.stringify(sortedTranslations, null, 2),
  "utf-8",
);

console.log(`✅ Total translations: ${Object.keys(sortedTranslations).length}`);
