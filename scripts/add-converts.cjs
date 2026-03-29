const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  // Converts - Lightning
  "Critical Strikes eliminate enemies under 8% Life":
    "暴击淘汰生命值低于 8% 的敌人",
  "Converts 6% of Physical Damage taken to random Elemental Damage":
    "将 6% 受到的物理伤害转化为随机元素伤害",
  "Converts (36-45)% of Erosion Damage taken to Lightning Damage":
    "将 (36-45)% 受到的腐蚀伤害转化为闪电伤害",
  "Converts (16-20)% of Physical Damage taken to Lightning Damage":
    "将 (16-20)% 受到的物理伤害转化为闪电伤害",
  "Converts (21-26)% of Physical Damage taken to Lightning Damage":
    "将 (21-26)% 受到的物理伤害转化为闪电伤害",
  "Converts (12-15)% of Physical Damage taken to Lightning Damage":
    "将 (12-15)% 受到的物理伤害转化为闪电伤害",
  "Converts (46-60)% of Erosion Damage taken to Lightning Damage":
    "将 (46-60)% 受到的腐蚀伤害转化为闪电伤害",
  "Converts (27-35)% of Erosion Damage taken to Lightning Damage":
    "将 (27-35)% 受到的腐蚀伤害转化为闪电伤害",
  // Converts - Cold
  "Converts (36-45)% of Erosion Damage taken to Cold Damage":
    "将 (36-45)% 受到的腐蚀伤害转化为冰冷伤害",
  "Converts (16-20)% of Physical Damage taken to Cold Damage":
    "将 (16-20)% 受到的物理伤害转化为冰冷伤害",
  "Converts (21-26)% of Physical Damage taken to Cold Damage":
    "将 (21-26)% 受到的物理伤害转化为冰冷伤害",
  "Converts (12-15)% of Physical Damage taken to Cold Damage":
    "将 (12-15)% 受到的物理伤害转化为冰冷伤害",
  "Converts (46-60)% of Erosion Damage taken to Cold Damage":
    "将 (46-60)% 受到的腐蚀伤害转化为冰冷伤害",
  "Converts (27-35)% of Erosion Damage taken to Cold Damage":
    "将 (27-35)% 受到的腐蚀伤害转化为冰冷伤害",
  // Converts - Fire
  "Converts (36-45)% of Erosion Damage taken to Fire Damage":
    "将 (36-45)% 受到的腐蚀伤害转化为火焰伤害",
  "Converts (16-20)% of Physical Damage taken to Fire Damage":
    "将 (16-20)% 受到的物理伤害转化为火焰伤害",
  "Converts (21-26)% of Physical Damage taken to Fire Damage":
    "将 (21-26)% 受到的物理伤害转化为火焰伤害",
  "Converts (12-15)% of Physical Damage taken to Fire Damage":
    "将 (12-15)% 受到的物理伤害转化为火焰伤害",
  "Converts (46-60)% of Erosion Damage taken to Fire Damage":
    "将 (46-60)% 受到的腐蚀伤害转化为火焰伤害",
  "Converts (27-35)% of Erosion Damage taken to Fire Damage":
    "将 (27-35)% 受到的腐蚀伤害转化为火焰伤害",
  // Lucky Critical
  "Lucky Critical Strike (-50--40)% Critical Strike Rating":
    "暴击幸运 (-50--40)% 暴击值",
  "Lucky Critical Strike (-80--50)% Critical Strike Rating":
    "暴击幸运 (-80--50)% 暴击值",
  // Damage Penetrates
  "Damage Penetrates (8-12)% Elemental Resistance": "伤害穿透 (8-12)% 元素抗性",
  "Damage Penetrates (5-8)% Elemental Resistance": "伤害穿透 (5-8)% 元素抗性",
  // Adds to gear
  "Adds (77-79) - (438-440) Elemental Damage to the gear -100% Gear Physical Damage":
    "在该装备上附加 (77-79) - (438-440) 点元素伤害 -100% 该装备物理伤害",
  "Adds (59-61) - (337-339) Elemental Damage to the gear -100% Gear Physical Damage":
    "在该装备上附加 (59-61) - (337-339) 点元素伤害 -100% 该装备物理伤害",
  "Adds (23-25) - (133-135) Elemental Damage to the gear -100% Gear Physical Damage":
    "在该装备上附加 (23-25) - (133-135) 点元素伤害 -100% 该装备物理伤害",
  "Adds (62-64) - (356-358) Elemental Damage to the gear -100% Gear Physical Damage":
    "在该装备上附加 (62-64) - (356-358) 点元素伤害 -100% 该装备物理伤害",
  "Adds (47-49) - (272-274) Elemental Damage to the gear -100% Gear Physical Damage":
    "在该装备上附加 (47-49) - (272-274) 点元素伤害 -100% 该装备物理伤害",
  "Adds (18-20) - (107-109) Elemental Damage to the gear -100% Gear Physical Damage":
    "在该装备上附加 (18-20) - (107-109) 点元素伤害 -100% 该装备物理伤害",
  // Projectile
  "Attack Horizontal Projectiles will return after reaching their max range and will hit enemies on their path again -30% additional Projectile Damage":
    "攻击直射投射物达到最大飞行距离后，会返回自身，并且可以再次击中路径上的敌人 -30% 额外投射物伤害",
  // Curse
  "You can cast 1 additional Curses +(8-10)% Curse Effect":
    "可以额外施展 1 个诅咒 +(8-10)% 诅咒效果",
  // Base Trauma Damage
  "Adds 630 - 1470 Base Trauma Damage": "附加 630 - 1470 基础创伤伤害",
  "Adds 480 - 1120 Base Trauma Damage": "附加 480 - 1120 基础创伤伤害",
  "Adds 330 - 770 Base Trauma Damage": "附加 330 - 770 基础创伤伤害",
  "Adds 240 - 560 Base Trauma Damage": "附加 240 - 560 基础创伤伤害",
  "Adds 180 - 420 Base Trauma Damage": "附加 180 - 420 基础创伤伤害",
  "Adds 1260 - 2940 Base Trauma Damage": "附加 1260 - 2940 基础创伤伤害",
  "Adds 960 - 2240 Base Trauma Damage": "附加 960 - 2240 基础创伤伤害",
  "Adds 660 - 1540 Base Trauma Damage": "附加 660 - 1540 基础创伤伤害",
  "Adds 360 - 840 Base Trauma Damage": "附加 360 - 840 基础创伤伤害",
  // Shadow
  "Shadow Quantity +2 +(10-15)% additional Shadow Damage":
    "影子数量 +2 额外 +(10-15)% 影子伤害",
  "Shadow Quantity +2 -5% additional Shadow Damage":
    "影子数量 +2 -5% 额外影子伤害",
  // Base Wilt Damage
  "Adds 72 - 88 Base Wilt Damage": "附加 72 - 88 基础凋零伤害",
  "Adds 56 - 67 Base Wilt Damage": "附加 56 - 67 基础凋零伤害",
};

let added = 0;
Object.entries(newTranslations).forEach((entry) => {
  if (!translations[entry[0]]) {
    translations[entry[0]] = entry[1];
    added++;
  }
});

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

console.log("已添加 " + added + " 个翻译");
console.log("总计: " + Object.keys(result).length + " 条翻译");
