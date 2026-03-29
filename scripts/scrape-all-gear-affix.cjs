const https = require("https");
const fs = require("fs");
const path = require("path");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(data);
        });
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

// 装备 URL 映射
const equipmentList = [
  { slug: "Belt", type: "Belt", slot: "Trinket" },
  { slug: "STR_Helmet", type: "Helmet-Str", slot: "Trinket" },
  { slug: "DEX_Helmet", type: "Helmet-Dex", slot: "Trinket" },
  { slug: "INT_Helmet", type: "Helmet-Int", slot: "Trinket" },
  { slug: "STR_Chest_Armor", type: "Chest-Str", slot: "Trinket" },
  { slug: "DEX_Chest_Armor", type: "Chest-Dex", slot: "Trinket" },
  { slug: "INT_Chest_Armor", type: "Chest-Int", slot: "Trinket" },
  { slug: "STR_Gloves", type: "Gloves-Str", slot: "Trinket" },
  { slug: "DEX_Gloves", type: "Gloves-Dex", slot: "Trinket" },
  { slug: "INT_Gloves", type: "Gloves-Int", slot: "Trinket" },
  { slug: "STR_Boots", type: "Boots-Str", slot: "Trinket" },
  { slug: "DEX_Boots", type: "Boots-Dex", slot: "Trinket" },
  { slug: "INT_Boots", type: "Boots-Int", slot: "Trinket" },
  { slug: "Claw", type: "Claw", slot: "Weapon" },
  { slug: "Dagger", type: "Dagger", slot: "Weapon" },
  { slug: "One-Handed_Sword", type: "One-Handed-Sword", slot: "Weapon" },
  { slug: "One-Handed_Hammer", type: "One-Handed-Hammer", slot: "Weapon" },
  { slug: "One-Handed_Axe", type: "One-Handed-Axe", slot: "Weapon" },
  { slug: "Rod", type: "Rod", slot: "Weapon" },
  { slug: "Wand", type: "Wand", slot: "Weapon" },
  { slug: "Scepter", type: "Scepter", slot: "Weapon" },
  { slug: "Cane", type: "Cane", slot: "Weapon" },
  { slug: "Pistol", type: "Pistol", slot: "Weapon" },
  { slug: "Two-Handed_Sword", type: "Two-Handed-Sword", slot: "Weapon" },
  { slug: "Two-Handed_Hammer", type: "Two-Handed-Hammer", slot: "Weapon" },
  { slug: "Two-Handed_Axe", type: "Two-Handed-Axe", slot: "Weapon" },
  { slug: "Tin_Staff", type: "Tin-Staff", slot: "Weapon" },
  { slug: "Cudgel", type: "Cudgel", slot: "Weapon" },
  { slug: "Bow", type: "Bow", slot: "Weapon" },
  { slug: "Crossbow", type: "Crossbow", slot: "Weapon" },
  { slug: "Musket", type: "Musket", slot: "Weapon" },
  { slug: "Fire_Cannon", type: "Fire-Cannon", slot: "Weapon" },
  { slug: "STR_Shield", type: "Shield-Str", slot: "Offhand" },
  { slug: "DEX_Shield", type: "Shield-Dex", slot: "Offhand" },
  { slug: "INT_Shield", type: "Shield-Int", slot: "Offhand" },
  { slug: "Necklace", type: "Necklace", slot: "Trinket" },
  { slug: "Ring", type: "Ring", slot: "Trinket" },
  { slug: "Spirit_Ring", type: "Spirit-Ring", slot: "Trinket" },
];

function cleanText(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;/g, "-")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getAffixType(typeText) {
  if (!typeText) return null;
  const lower = typeText.toLowerCase();
  if (lower.includes("base affix")) return "Base Affix";
  if (lower.includes("pre-fix")) return "Prefix";
  if (lower.includes("suffix")) return "Suffix";
  if (lower.includes("sweet dream")) return "Sweet Dream Affix";
  if (lower.includes("tower sequence")) return "Tower Sequence";
  if (lower.includes("corrosion")) return "Corrosion Base";
  if (lower.includes("blending")) return "Blending";
  return null;
}

function getCraftingPool(typeText) {
  if (!typeText) return "Basic";
  const lower = typeText.toLowerCase();
  if (lower.includes("basic")) return "Basic";
  if (lower.includes("advanced")) return "Advanced";
  if (lower.includes("ultimate")) return "Ultimate";
  return "Basic";
}

async function scrapePage(equipment) {
  try {
    const [enHtml, cnHtml] = await Promise.all([
      fetchUrl("https://tlidb.com/en/" + equipment.slug),
      fetchUrl("https://tlidb.com/cn/" + equipment.slug),
    ]);

    if (enHtml.length < 1000 || cnHtml.length < 1000) {
      return { affixes: [], translations: {} };
    }

    // 提取表格行
    const enById = {};
    const cnById = {};

    // 匹配 <tr>...</tr>
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch;

    while ((rowMatch = rowRegex.exec(enHtml)) !== null) {
      const row = rowMatch[1];

      // 提取 td
      const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      const cells = [];
      let tdMatch;

      while ((tdMatch = tdRegex.exec(row)) !== null) {
        cells.push(cleanText(tdMatch[1]));
      }

      // 需要至少3列: 词缀, 来源, 类型
      if (cells.length >= 3) {
        const affixText = cells[0];
        const source = cells[1];
        const affixType = getAffixType(cells[2]);

        if (affixText && affixType && !affixText.includes("Affix Effect")) {
          // 提取 data-modifier-id
          const idMatch = row.match(/data-modifier-id="(\d+)"/);
          const id = idMatch ? idMatch[1] : affixText;
          enById[id] = {
            affix: affixText,
            type: affixType,
            pool: getCraftingPool(cells[2]),
          };
        }
      }
    }

    // 提取 CN 翻译
    while ((rowMatch = rowRegex.exec(cnHtml)) !== null) {
      const row = rowMatch[1];
      const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      const cells = [];
      let tdMatch;

      while ((tdMatch = tdRegex.exec(row)) !== null) {
        cells.push(cleanText(tdMatch[1]));
      }

      if (cells.length >= 1) {
        const idMatch = row.match(/data-modifier-id="(\d+)"/);
        if (idMatch) {
          cnById[idMatch[1]] = cells[0];
        }
      }
    }

    // 生成词缀数据
    const affixes = [];
    const translations = {};

    Object.entries(enById).forEach((entry) => {
      const id = entry[0];
      const data = entry[1];

      // 生成词缀
      affixes.push({
        equipmentSlot: equipment.slot,
        equipmentType: equipment.type,
        affixType: data.type,
        craftingPool: data.pool,
        tier: "1",
        craftableAffix: data.affix,
      });

      // 生成翻译
      if (cnById[id] && cnById[id] !== data.affix) {
        translations[data.affix] = cnById[id];
      }
    });

    return { affixes, translations };
  } catch (e) {
    console.log("错误: " + e.message);
    return { affixes: [], translations: {} };
  }
}

async function main() {
  console.log("=== 从网页抓取所有装备词缀 ===\n");

  const outputDir = path.join(__dirname, "../src/data/gear-affix-new");

  // 创建输出目录
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true });
  }
  fs.mkdirSync(outputDir);

  const allTranslations = {};
  const allAffixes = [];

  let totalAffixes = 0;
  let totalTranslations = 0;

  for (let i = 0; i < equipmentList.length; i++) {
    const equipment = equipmentList[i];

    process.stdout.write(
      "[" +
        (i + 1) +
        "/" +
        equipmentList.length +
        "] " +
        equipment.type +
        "... ",
    );

    const result = await scrapePage(equipment);

    totalAffixes += result.affixes.length;
    totalTranslations += Object.keys(result.translations).length;

    console.log(
      result.affixes.length +
        " 词缀, " +
        Object.keys(result.translations).length +
        " 翻译",
    );

    // 保存词缀到文件
    if (result.affixes.length > 0) {
      // 按类型分组
      const byType = {};
      result.affixes.forEach((a) => {
        if (!byType[a.affixType]) byType[a.affixType] = [];
        byType[a.affixType].push(a);
      });

      Object.entries(byType).forEach((entry) => {
        const affixType = entry[0];
        const items = entry[1];

        // 生成文件名
        const fileName =
          equipment.type.toLowerCase() +
          "-" +
          affixType.toLowerCase().replace(/ /g, "-") +
          ".ts";

        // 生成 TypeScript 内容
        const exportName =
          equipment.type.toUpperCase().replace(/-/g, "_") +
          "_" +
          affixType.toUpperCase().replace(/ /g, "_") +
          "_AFFIXES";

        let content = "// Auto-generated from tlidb.com\n";
        content +=
          'import type { BaseGearAffix } from "../../tli/gear-data-types";\n\n';
        content +=
          "export const " + exportName + ": readonly BaseGearAffix[] = [\n";

        items.forEach((item) => {
          content += "  {\n";
          content += '    equipmentSlot: "' + item.equipmentSlot + '",\n';
          content += '    equipmentType: "' + item.equipmentType + '",\n';
          content += '    affixType: "' + item.affixType + '",\n';
          content += '    craftingPool: "' + item.craftingPool + '",\n';
          content += '    tier: "' + item.tier + '",\n';
          content +=
            '    craftableAffix: "' +
            item.craftableAffix.replace(/"/g, '\\"') +
            '",\n';
          content += "  },\n";
        });

        content += "] as const;\n";

        fs.writeFileSync(path.join(outputDir, fileName), content);
      });
    }

    allAffixes.push(...result.affixes);
    Object.assign(allTranslations, result.translations);

    await new Promise((r) => {
      setTimeout(r, 100);
    });
  }

  console.log("\n=== 统计 ===");
  console.log("总词缀: " + totalAffixes);
  console.log("总翻译: " + totalTranslations);

  // 保存翻译
  const sortedTranslations = Object.entries(allTranslations).sort(
    (a, b) => b[0].length - a[0].length,
  );
  const resultTranslations = {};
  sortedTranslations.forEach((entry) => {
    resultTranslations[entry[0]] = entry[1];
  });

  fs.writeFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    JSON.stringify(resultTranslations, null, 2),
  );

  console.log("\n=== 输出 ===");
  console.log("词缀目录: " + outputDir);
  console.log(
    "翻译文件: src/data/translated-affixes/merged-all-translations.json",
  );
  console.log("翻译总数: " + Object.keys(resultTranslations).length);
}

main();
