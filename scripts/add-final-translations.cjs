const fs = require("fs");

console.log("=== 添加更多翻译 ===\n");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const finalTranslations = {
  "Attack Horizontal Projectiles will return after reaching their max range and will hit enemies on their path again":
    "攻击直射投射物达到最大飞行距离后，会返回自身，并且可以再次击中路径上的敌人",
  "+200% Precise Projectiles Aura effect -30% additional Precise Projectiles Sealed":
    "+200% 精密投射物光环效果额外 -30% 精密投射物封印",
  "+30% additional Deterioration Damage 10% chance to inflict 2 additional stack(s)":
    "额外 +30% 恶化伤害 10% 几率额外施加 2 层",
  "+120% Precise Projectiles Aura effect -20% additional Precise Projectiles Sealed":
    "+120% 精密投射物光环效果额外 -20% 精密投射物封印",
  "+15% additional Deterioration Damage 10% chance to inflict 1 additional stack(s)":
    "额外 +15% 恶化伤害 10% 几率额外施加 1 层",
  "+(10-15)% Attack and Spell Block Chance while standing still":
    "静止时，+(10-15)% 攻击和法术格挡几率",
  "50% chance to gain Hardened when you are hit":
    "受到伤害时，50% 几率获得硬化",
  "+6% Max Life": "+6% 最大生命",
  "You can cast 1 additional Curses +(8-10)% Curse Effect":
    "可以额外施加 1 个诅咒 +(8-10)% 诅咒效果",
  "+7% Dexterity": "+7% 敏捷",
  "+7% Intelligence": "+7% 智慧",
  "+7% Strength": "+7% 力量",
  "Regenerates 4% Life per second when affecting Damage Over Time":
    "影响持续伤害时，每秒自然回复 4% 生命",
  "Regenerates 3% Life per second when affecting Damage Over Time":
    "影响持续伤害时，每秒自然回复 3% 生命",
  "+8% Max Life": "+8% 最大生命",
  "+10% Max Life": "+10% 最大生命",
  "+15% Max Life": "+15% 最大生命",
};

let added = 0;
Object.entries(finalTranslations).forEach((entry) => {
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
