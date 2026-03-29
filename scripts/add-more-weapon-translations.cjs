const fs = require("fs");

console.log("=== 添加更多武器翻译 ===\n");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const moreTranslations = {
  "Main Skill is supported by Lv. 25 Multiple Projectiles +25% additional Projectile Damage":
    "核心技能被 25 级多重投射辅助额外 +25% 投射物伤害",
  "+7% Life Regain": "+7% 生命返还",
  "+7% Energy Shield Regain": "+7% 护盾返还",
  "+1 Support Skill Level": "+1 辅助技能等级",
  "+(33-47)% Attack and Cast Speed +(33-47)% Minion Attack and Cast Speed":
    "+(33-47)% 攻击和施法速度+(33-47)% 召唤物攻击和施法速度",
  "+(26-36)% Attack and Cast Speed +(26-36)% Minion Attack and Cast Speed":
    "+(26-36)% 攻击和施法速度+(26-36)% 召唤物攻击和施法速度",
  "+(21-25)% Attack and Cast Speed +(21-25)% Minion Attack and Cast Speed":
    "+(21-25)% 攻击和施法速度+(21-25)% 召唤物攻击和施法速度",
  "+(15-18)% Attack and Cast Speed +(15-18)% Minion Attack and Cast Speed":
    "+(15-18)% 攻击和施法速度+(15-18)% 召唤物攻击和施法速度",
  "+120% Precise Projectiles Aura effect -20% additional Precise Projectiles Sealed":
    "+120% 精密投射物光环效果额外 -20% 精密投射物封印",
  "+80% Gear Physical Damage -20% Attack Critical Strike Rating for this gear":
    "+80% 该装备物理伤害-20% 该装备的攻击暴击值",
  "+15% additional Deterioration Damage 10% chance to inflict 1 additional stack(s)":
    "额外 +15% 恶化伤害 10% 几率额外施加 1 层",
  "+25% Gear Elemental Damage -25% Gear Physical Damage":
    "+25% 该装备元素伤害-25% 该装备物理伤害",
  "Adds (47-49) - (272-274) Elemental Damage to the gear -100% Gear Physical Damage":
    "在该装备上附加 (47-49) - (272-274) 点元素伤害-100% 该装备物理伤害",
  "Adds (18-20) - (107-109) Elemental Damage to the gear -100% Gear Physical Damage":
    "在该装备上附加 (18-20) - (107-109) 点元素伤害-100% 该装备物理伤害",
  "+10% Life Regain": "+10% 生命返还",
  "+10% Energy Shield Regain": "+10% 护盾返还",
  "+15% additional Deterioration Damage 10% chance to inflict 2 additional stack(s)":
    "额外 +15% 恶化伤害 10% 几率额外施加 2 层",
  "+200% Precise Projectiles Aura effect -30% additional Precise Projectiles Sealed":
    "+200% 精密投射物光环效果额外 -30% 精密投射物封印",
  "+50% Gear Elemental Damage -25% Gear Physical Damage":
    "+50% 该装备元素伤害-25% 该装备物理伤害",
};

let added = 0;
Object.entries(moreTranslations).forEach((entry) => {
  const en = entry[0];
  const cn = entry[1];

  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log("添加了 " + added + " 个翻译");

// 保存
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

console.log("总计: " + Object.keys(result).length + " 条翻译");
