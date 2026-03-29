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

console.log("📊 分析 missing-affixes.json 与抓取数据的差异\n");

console.log(`抓取到的翻译: ${Object.keys(scrapedTranslations).length}`);
console.log(`missing-affixes.json 总数: ${missingAffixes.length}`);

const foundInScraped = [];
const notFound = [];

missingAffixes.forEach((affix) => {
  if (scrapedTranslations[affix]) {
    foundInScraped.push({ en: affix, cn: scrapedTranslations[affix] });
  } else {
    notFound.push(affix);
  }
});

console.log(`\n✅ 已覆盖: ${foundInScraped.length}`);
console.log(`❌ 未覆盖: ${notFound.length}`);
console.log(
  `📈 覆盖率: ${((foundInScraped.length / missingAffixes.length) * 100).toFixed(1)}%`,
);

const output = {
  stats: {
    totalScraped: Object.keys(scrapedTranslations).length,
    totalMissing: missingAffixes.length,
    covered: foundInScraped.length,
    notCovered: notFound.length,
    coverage: `${((foundInScraped.length / missingAffixes.length) * 100).toFixed(1)}%`,
  },
  covered: foundInScraped,
  notCovered: notFound,
};

fs.writeFileSync(
  path.join(scriptsDir, "missing-affixes-analysis.json"),
  JSON.stringify(output, null, 2),
  "utf-8",
);
console.log(`\n✅ 保存分析结果到 missing-affixes-analysis.json`);

console.log("\n" + "=".repeat(60));
console.log("\n📋 未覆盖的词缀列表 (按类型分类):\n");

function categorizeAffix(affix) {
  const lower = affix.toLowerCase();

  if (lower.includes("max life") && /max life/i.test(affix)) return "Max Life";
  if (lower.includes("max mana") && /max mana/i.test(affix)) return "Max Mana";
  if (lower.includes("max energy shield") && /max energy shield/i.test(affix))
    return "Max Energy Shield";
  if (lower.includes("resistance") || lower.includes("抗性"))
    return "Resistance";
  if (lower.includes("movement speed") || lower.includes("移动速度"))
    return "Movement Speed";
  if (lower.includes("cooldown") || lower.includes("冷却")) return "Cooldown";
  if (lower.includes("skill effect duration") || lower.includes("技能持续"))
    return "Skill Duration";
  if (lower.includes("sealed mana") || lower.includes("魔力封印"))
    return "Sealed Mana";
  if (lower.includes("aura") || lower.includes("光环")) return "Aura Effect";
  if (lower.includes("immune") || lower.includes("免疫")) return "Immunity";
  if (lower.includes("max elemental") || lower.includes("元素抗性上限"))
    return "Max Elemental Resistance";
  if (lower.includes("restoration") || lower.includes("回复"))
    return "Restoration";
  if (lower.includes("block chance") || lower.includes("格挡"))
    return "Block Chance";
  if (lower.includes("damage") || lower.includes("伤害")) return "Damage";
  if (lower.includes("minion") || lower.includes("召唤物")) return "Minion";
  if (lower.includes("critical") || lower.includes("暴击")) return "Critical";
  if (
    lower.includes("strength") ||
    (lower.includes("力量") && !lower.includes("dexterity"))
  )
    return "Strength";
  if (lower.includes("dexterity") || lower.includes("敏捷")) return "Dexterity";
  if (lower.includes("intelligence") || lower.includes("智慧"))
    return "Intelligence";
  if (lower.includes("defense") || lower.includes("防御")) return "Defense";
  if (lower.includes("health") || lower.includes("生命回复"))
    return "Health Regen";
  if (lower.includes("mana") && !lower.includes("max mana"))
    return "Mana Regen";
  if (lower.includes("energy shield") || lower.includes("护盾"))
    return "Energy Shield";
  if (lower.includes("ailment") || lower.includes("异常")) return "Ailment";
  if (lower.includes("duration") || lower.includes("持续时间"))
    return "Duration";
  if (lower.includes("chance") || lower.includes("几率")) return "Chance";
  if (lower.includes("penetration") || lower.includes("穿透"))
    return "Penetration";
  if (lower.includes("projectile") || lower.includes("投射物"))
    return "Projectile";
  if (lower.includes("barrage") || lower.includes("弹幕")) return "Barrage";
  if (lower.includes("curse") || lower.includes("诅咒")) return "Curse";
  if (lower.includes("summon") || lower.includes("召唤")) return "Summon";
  if (lower.includes("skill") || lower.includes("技能")) return "Skill";
  if (lower.includes("amplification") || lower.includes("增幅"))
    return "Amplification";
  if (lower.includes("conversion") || lower.includes("转化"))
    return "Conversion";
  if (lower.includes("fortitude") || lower.includes("坚韧")) return "Fortitude";
  if (lower.includes("channel") || lower.includes("引导")) return "Channeling";
  if (lower.includes("ignite") || lower.includes("点燃")) return "Ignite";
  if (lower.includes("trauma") || lower.includes("创伤")) return "Trauma";
  if (lower.includes("wilt") || lower.includes("凋零")) return "Wilt";
  if (lower.includes("deterioration") || lower.includes("恶化"))
    return "Deterioration";
  if (lower.includes("infiltration") || lower.includes("渗透"))
    return "Infiltration";
  if (lower.includes("affliction") || lower.includes("施加"))
    return "Affliction";
  if (lower.includes("reap") || lower.includes("收割")) return "Reap";
  if (lower.includes("elite") || lower.includes("精英")) return "Elite";
  if (lower.includes("boss")) return "Boss";
  if (lower.includes("elite")) return "Elite";
  if (lower.includes("overcharge") || lower.includes("过载"))
    return "Overcharge";
  if (lower.includes("focus") || lower.includes("聚能")) return "Focus";
  if (lower.includes("agility") || lower.includes("灵动")) return "Agility";
  if (lower.includes("tenacity") || lower.includes("坚韧祝福"))
    return "Tenacity Blessing";
  if (lower.includes("blessing") || lower.includes("祝福")) return "Blessing";
  if (lower.includes("stack") || lower.includes("层数")) return "Stacks";
  if (lower.includes("charged") || lower.includes("充能")) return "Charged";
  if (lower.includes("spell burst") || lower.includes("法术迸发"))
    return "Spell Burst";
  if (lower.includes("combo") || lower.includes("连携")) return "Combo";
  if (lower.includes("order") || lower.includes("号令")) return "Order";
  if (lower.includes("precise projectile") || lower.includes("精准投射"))
    return "Precise Projectile";
  if (lower.includes("warcry") || lower.includes("战吼")) return "Warcry";
  if (lower.includes("chaos") || lower.includes("混沌")) return "Chaos";
  if (lower.includes("frost") || lower.includes("冰霜")) return "Frost";
  if (lower.includes("spirit") && !lower.includes("spirit ring"))
    return "Spirit";
  if (lower.includes("corrosion") || lower.includes("腐蚀")) return "Corrosion";
  if (lower.includes("armor") || lower.includes("护甲")) return "Armor";
  if (lower.includes("evasion") || lower.includes("闪避")) return "Evasion";
  if (lower.includes("shield") || lower.includes("护盾")) return "Shield";
  if (lower.includes("slow") || lower.includes("减速")) return "Slow";
  if (lower.includes("paralysis") || lower.includes("麻痹")) return "Paralysis";
  if (lower.includes("blinding") || lower.includes("致盲")) return "Blinding";
  if (lower.includes("freeze") || lower.includes("冻结")) return "Freeze";
  if (lower.includes("taunt") || lower.includes("嘲讽")) return "Taunt";
  if (lower.includes("wither") || lower.includes("枯萎")) return "Wither";
  if (lower.includes("warp") || lower.includes("扭曲")) return "Warp";
  if (lower.includes("bleed") || lower.includes("流血")) return "Bleed";
  if (lower.includes("petrification") || lower.includes("石化"))
    return "Petrification";
  if (lower.includes("silence") || lower.includes("沉默")) return "Silence";
  if (lower.includes("root") || lower.includes("定身")) return "Root";
  if (lower.includes("knockback") || lower.includes("击退")) return "Knockback";
  if (lower.includes("stun") || lower.includes("眩晕")) return "Stun";
  if (lower.includes("burn") || lower.includes("灼烧")) return "Burn";
  if (lower.includes("frostbite") || lower.includes("冻伤")) return "Frostbite";
  if (lower.includes("shock") || lower.includes("电击")) return "Shock";
  if (lower.includes("poison") || lower.includes("中毒")) return "Poison";
  if (lower.includes("disease") || lower.includes("疾病")) return "Disease";
  if (lower.includes("bleed") || lower.includes("裂伤")) return "Bleed";
  if (lower.includes("weaken") || lower.includes("虚弱")) return "Weaken";
  if (lower.includes("cripple") || lower.includes("残废")) return "Cripple";
  if (lower.includes("blind") || lower.includes("失明")) return "Blind";
  if (lower.includes("immobilize") || lower.includes("定身"))
    return "Immobilize";
  if (lower.includes("freeze") || lower.includes("冻结")) return "Freeze";
  if (lower.includes("burning") || lower.includes("燃烧")) return "Burning";
  if (lower.includes("chilled") || lower.includes("冰冷")) return "Chilled";
  if (lower.includes("shocked") || lower.includes("电击")) return "Shocked";
  if (lower.includes("poisoned") || lower.includes("中毒")) return "Poisoned";
  if (lower.includes("bleeding") || lower.includes("流血")) return "Bleeding";
  if (lower.includes("on hit") || lower.includes("击中时")) return "On Hit";
  if (lower.includes("on kill") || lower.includes("击杀时")) return "On Kill";
  if (lower.includes("on crit") || lower.includes("暴击时")) return "On Crit";
  if (lower.includes("on hit taken") || lower.includes("受到伤害时"))
    return "On Hit Taken";
  if (lower.includes("when hit") || lower.includes("被击中时"))
    return "When Hit";
  if (lower.includes("when cast") || lower.includes("释放时"))
    return "When Cast";
  if (lower.includes("when use") || lower.includes("使用技能时"))
    return "When Use";
  if (lower.includes("while") || lower.includes("当")) return "While";
  if (lower.includes("at low") || lower.includes("低生命")) return "At Low HP";
  if (lower.includes("at full") || lower.includes("满生命"))
    return "At Full HP";
  if (lower.includes("health") || lower.includes("生命")) return "Health";
  if (lower.includes("mana") || lower.includes("魔力")) return "Mana";
  if (lower.includes("energy") || lower.includes("能量")) return "Energy";
  if (lower.includes("rage") || lower.includes("怒气")) return "Rage";
  if (lower.includes("fury") || lower.includes("狂怒")) return "Fury";
  if (lower.includes("wrath") || lower.includes("天罚")) return "Wrath";
  if (lower.includes("soul") || lower.includes("灵魂")) return "Soul";
  if (lower.includes("essence") || lower.includes("精华")) return "Essence";
  if (lower.includes("experience") || lower.includes("经验"))
    return "Experience";
  if (lower.includes("gold") || lower.includes("金币")) return "Gold";
  if (lower.includes("magic find") || lower.includes("魔法物品"))
    return "Magic Find";
  if (lower.includes("rarer") || lower.includes("稀有")) return "Rarity";
  if (lower.includes("loot") || lower.includes("掉落")) return "Loot";
  if (lower.includes("drop") || lower.includes("掉落")) return "Drop";
  if (lower.includes("pickup") || lower.includes("拾取")) return "Pickup";
  if (lower.includes("radius") || lower.includes("范围")) return "Radius";
  if (lower.includes("area") || lower.includes("范围")) return "Area";
  if (lower.includes("range") || lower.includes("距离")) return "Range";
  if (lower.includes("speed") || lower.includes("速度")) return "Speed";
  if (lower.includes("cast") || lower.includes("释放")) return "Cast";
  if (lower.includes("cooldown") || lower.includes("冷却")) return "Cooldown";
  if (lower.includes("duration") || lower.includes("持续")) return "Duration";
  if (lower.includes("level") || lower.includes("等级")) return "Level";
  if (lower.includes("quality") || lower.includes("品质")) return "Quality";
  if (lower.includes("socket") || lower.includes("孔位")) return "Socket";
  if (lower.includes("gems") || lower.includes("宝石")) return "Gems";
  if (lower.includes("enchant") || lower.includes("附魔")) return "Enchant";
  if (lower.includes("forge") || lower.includes("锻造")) return "Forge";
  if (lower.includes("craft") || lower.includes("制作")) return "Craft";
  if (lower.includes("reforge") || lower.includes("重铸")) return "Reforge";
  if (lower.includes("upgrade") || lower.includes("升级")) return "Upgrade";
  if (lower.includes("enhance") || lower.includes("强化")) return "Enhance";
  if (lower.includes("improve") || lower.includes("提升")) return "Improve";
  if (lower.includes("increase") || lower.includes("增加")) return "Increase";
  if (lower.includes("reduce") || lower.includes("减少")) return "Reduce";
  if (lower.includes("decrease") || lower.includes("降低")) return "Decrease";
  if (lower.includes("additional") || lower.includes("额外"))
    return "Additional";
  if (lower.includes("bonus") || lower.includes("加成")) return "Bonus";
  if (lower.includes("multiplier") || lower.includes("乘算"))
    return "Multiplier";
  if (lower.includes("effective") || lower.includes("有效")) return "Effective";
  if (lower.includes("efficiency") || lower.includes("效率"))
    return "Efficiency";
  if (lower.includes("recovery") || lower.includes("回复")) return "Recovery";
  if (lower.includes("regen") || lower.includes("回复")) return "Regen";
  if (lower.includes("drain") || lower.includes("吸取")) return "Drain";
  if (lower.includes("leech") || lower.includes("偷取")) return "Leech";
  if (lower.includes("absorb") || lower.includes("吸收")) return "Absorb";
  if (lower.includes("reflect") || lower.includes("反射")) return "Reflect";
  if (lower.includes("avoid") || lower.includes("避免")) return "Avoid";
  if (lower.includes("prevent") || lower.includes("防止")) return "Prevent";
  if (lower.includes("block") || lower.includes("格挡")) return "Block";
  if (lower.includes("dodge") || lower.includes("闪避")) return "Dodge";
  if (lower.includes("parry") || lower.includes("招架")) return "Parry";
  if (lower.includes("evade") || lower.includes("闪避")) return "Evade";
  if (lower.includes("counter") || lower.includes("反击")) return "Counter";
  if (lower.includes("riposte") || lower.includes("还击")) return "Riposte";
  if (lower.includes("lifesteal") || lower.includes("生命偷取"))
    return "Lifesteal";
  if (lower.includes("manasteal") || lower.includes("魔力偷取"))
    return "Manasteal";
  if (lower.includes("attack speed") || lower.includes("攻击速度"))
    return "Attack Speed";
  if (lower.includes("cast speed") || lower.includes("施法速度"))
    return "Cast Speed";
  if (lower.includes("movement speed") || lower.includes("移动速度"))
    return "Movement Speed";
  if (lower.includes("charge speed") || lower.includes("充能速度"))
    return "Charge Speed";
  if (lower.includes("reload speed") || lower.includes("装填速度"))
    return "Reload Speed";
  if (lower.includes("cooldown speed") || lower.includes("冷却速度"))
    return "Cooldown Speed";
  if (lower.includes("attack damage") || lower.includes("攻击伤害"))
    return "Attack Damage";
  if (lower.includes("spell damage") || lower.includes("法术伤害"))
    return "Spell Damage";
  if (lower.includes("physical damage") || lower.includes("物理伤害"))
    return "Physical Damage";
  if (lower.includes("elemental damage") || lower.includes("元素伤害"))
    return "Elemental Damage";
  if (lower.includes("fire damage") || lower.includes("火焰伤害"))
    return "Fire Damage";
  if (lower.includes("cold damage") || lower.includes("冰冷伤害"))
    return "Cold Damage";
  if (lower.includes("lightning damage") || lower.includes("闪电伤害"))
    return "Lightning Damage";
  if (lower.includes("true damage") || lower.includes("真实伤害"))
    return "True Damage";
  if (lower.includes("critical damage") || lower.includes("暴击伤害"))
    return "Critical Damage";
  if (lower.includes("critical chance") || lower.includes("暴击几率"))
    return "Critical Chance";
  if (lower.includes("critical rating") || lower.includes("暴击值"))
    return "Critical Rating";
  if (lower.includes("critical multiplier") || lower.includes("暴击乘算"))
    return "Critical Multiplier";
  if (lower.includes("overkill") || lower.includes(" overkill"))
    return "Overkill";
  if (lower.includes("overhit") || lower.includes(" overheal"))
    return "Overhit";
  if (lower.includes("overheal") || lower.includes("overheal"))
    return "Overheal";
  if (lower.includes("overcharge") || lower.includes("overcharge"))
    return "Overcharge";
  if (lower.includes("overdrive") || lower.includes("overdrive"))
    return "Overdrive";
  if (lower.includes("overload") || lower.includes("overload"))
    return "Overload";
  if (lower.includes("overflow") || lower.includes("overflow"))
    return "Overflow";
  if (lower.includes("over") && lower.includes("damage")) return "Over Damage";
  if (lower.includes("dot") || lower.includes("dot")) return "DoT";
  if (lower.includes("damage over time") || lower.includes("持续伤害"))
    return "DoT";
  if (lower.includes("hot") || lower.includes("hot")) return "HoT";
  if (lower.includes("heal over time") || lower.includes("持续治疗"))
    return "HoT";

  return "Other";
}

const categorized = {};
notFound.forEach((affix) => {
  const category = categorizeAffix(affix);
  if (!categorized[category]) {
    categorized[category] = [];
  }
  categorized[category].push(affix);
});

const sortedCategories = Object.keys(categorized).sort(
  (a, b) => categorized[b].length - categorized[a].length,
);

console.log("\n📊 未覆盖词缀分类统计:\n");
sortedCategories.forEach((cat) => {
  console.log(`  ${cat}: ${categorized[cat].length} 条`);
});

console.log("\n" + "=".repeat(60));
console.log("\n📋 详细列表 (按分类):\n");

sortedCategories.forEach((cat) => {
  console.log(`\n### ${cat} (${categorized[cat].length})`);
  console.log("-".repeat(40));
  categorized[cat].slice(0, 20).forEach((affix) => {
    console.log(`  - ${affix}`);
  });
  if (categorized[cat].length > 20) {
    console.log(`  ... 还有 ${categorized[cat].length - 20} 条`);
  }
});

fs.writeFileSync(
  path.join(scriptsDir, "missing-affixes-by-category.json"),
  JSON.stringify(categorized, null, 2),
  "utf-8",
);
console.log(`\n✅ 保存分类结果到 missing-affixes-by-category.json`);
