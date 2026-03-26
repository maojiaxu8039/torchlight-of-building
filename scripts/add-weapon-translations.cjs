const fs = require("fs");

console.log("=== 添加武器翻译 ===\n");

const translations = JSON.parse(fs.readFileSync("src/data/translated-affixes/merged-all-translations.json", "utf8"));

const weaponTranslations = {
  "+(111-145)% Gear Physical Damage Adds (69-71) - (85-87) Physical Damage to the gear": "+(111-145)% 该装备物理伤害在该装备上附加 (69-71) - (85-87) 点物理伤害",
  "+(77-110)% Gear Physical Damage Adds (53-55) - (65-67) Physical Damage to the gear": "+(77-110)% 该装备物理伤害在该装备上附加 (53-55) - (65-67) 点物理伤害",
  "Adds (77-79) - (438-440) Elemental Damage to the gear -100% Gear Physical Damage": "在该装备上附加 (77-79) - (438-440) 点元素伤害-100% 该装备物理伤害",
  "Adds (59-61) - (337-339) Elemental Damage to the gear -100% Gear Physical Damage": "在该装备上附加 (59-61) - (337-339) 点元素伤害-100% 该装备物理伤害",
  "Adds (23-25) - (133-135) Elemental Damage to the gear -100% Gear Physical Damage": "在该装备上附加 (23-25) - (133-135) 点元素伤害-100% 该装备物理伤害",
  "+(66-94)% Attack and Cast Speed +(66-94)% Minion Attack and Cast Speed": "+(66-94)% 攻击和施法速度+(66-94)% 召唤物攻击和施法速度",
  "+(51-72)% Attack and Cast Speed +(51-72)% Minion Attack and Cast Speed": "+(51-72)% 攻击和施法速度+(51-72)% 召唤物攻击和施法速度",
  "+(43-50)% Attack and Cast Speed +(43-50)% Minion Attack and Cast Speed": "+(43-50)% 攻击和施法速度+(43-50)% 召唤物攻击和施法速度",
  "+(31-36)% Attack and Cast Speed +(31-36)% Minion Attack and Cast Speed": "+(31-36)% 攻击和施法速度+(31-36)% 召唤物攻击和施法速度",
  "Max Sentry Quantity +2 +10% additional damage": "哨卫数量上限 +2 额外 +10% 伤害",
  "Lucky Critical Strike (-80--50)% Critical Strike Rating": "暴击 幸运 (-80--50)% 暴击值",
  "Lucky Critical Strike (-50--40)% Critical Strike Rating": "暴击 幸运 (-50--40)% 暴击值",
  "+3 to Attack Skill Level": "+3 攻击技能等级",
  "+2 to Attack Skill Level": "+2 攻击技能等级",
  "+3 to All Skills' Levels": "+3 全部技能等级",
  "+2 to All Skills' Levels": "+2 全部技能等级",
  "+(3-4) to Attack Skill Level": "+(3-4) 攻击技能等级",
  "Adds (62-64) - (356-358) Elemental Damage to the gear -100% Gear Physical Damage": "在该装备上附加 (62-64) - (356-358) 点元素伤害-100% 该装备物理伤害",
};

let added = 0;
Object.entries(weaponTranslations).forEach(function(entry) {
  const en = entry[0];
  const cn = entry[1];
  
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log("添加了 " + added + " 个翻译");

// 保存
const sorted = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
const result = {};
sorted.forEach(e => { result[e[0]] = e[1]; });
fs.writeFileSync("src/data/translated-affixes/merged-all-translations.json", JSON.stringify(result, null, 2));

console.log("总计: " + Object.keys(result).length + " 条翻译");
