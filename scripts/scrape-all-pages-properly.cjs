const fs = require("fs");
const path = require("path");
const https = require("https");

const PAGES = [
  { url: "Craft", name: "Craft词缀" },
  { url: "Legendary_Gear", name: "传奇装备" },
  { url: "Talent", name: "神格石板/天赋" },
  { url: "Active_Skill", name: "主动技能" },
  { url: "Support_Skill", name: "辅助技能" },
  { url: "Passive_Skill", name: "被动技能" },
  { url: "Activation_Medium_Skill", name: "触媒技能" },
  { url: "Noble_Support_Skill", name: "崇高辅助技能" },
  { url: "Magnificent_Support_Skill", name: "华贵辅助技能" },
  { url: "Hero", name: "英雄" },
  { url: "Pactspirit", name: "契约之灵" },
  { url: "Ethereal_Prism", name: "异度棱镜" },
  { url: "Destiny", name: "命运" },
  { url: "Corrosion", name: "侵蚀" },
  { url: "Dream_Talking", name: "梦语" },
  { url: "Blending_Rituals", name: "调香秘仪" },
  { url: "TOWER_Sequence", name: "高塔序列" },
  { url: "Graft", name: "缝合" },
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

function extractByModifierId(html) {
  const result = new Map();

  // 提取所有带有 data-modifier-id 的行
  const trPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch;

  while ((trMatch = trPattern.exec(html)) !== null) {
    const trContent = trMatch[1];

    // 查找 data-modifier-id
    const idMatch = trContent.match(/data-modifier-id=["']([^"']+)["']/);
    if (!idMatch) continue;

    const modifierId = idMatch[1];

    // 查找最后一个 td 的文本（通常是词缀文本）
    const tdPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const tds = [];
    let tdMatch;

    while ((tdMatch = tdPattern.exec(trContent)) !== null) {
      // 清理 HTML 标签，保留纯文本
      const text = tdMatch[1]
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&ndash;/g, "–")
        .replace(/&mdash;/g, "—")
        .replace(/\s+/g, " ")
        .trim();

      if (text) tds.push(text);
    }

    // 通常最后一个 td 是词缀文本
    if (tds.length > 0) {
      const affixText = tds[tds.length - 1];
      if (affixText && affixText.length > 1) {
        result.set(modifierId, affixText);
      }
    }
  }

  return result;
}

function extractByHref(html) {
  const result = new Map();

  // 从链接中提取
  const linkPattern = /<a[^>]+href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
  let match;

  while ((match = linkPattern.exec(html)) !== null) {
    const href = match[1];
    const text = match[2]
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();

    if (href && text && href.startsWith("/")) {
      const enName = href.replace(/\//g, "").replace(/_/g, " ");
      if (text !== enName && text.length > 1) {
        result.set(enName, text);
      }
    }
  }

  return result;
}

async function scrapePage(page) {
  console.log(`\n📄 Scraping: ${page.name}`);

  try {
    const [enHtml, cnHtml] = await Promise.all([
      fetchUrl(`https://tlidb.com/en/${page.url}`),
      fetchUrl(`https://tlidb.com/cn/${page.url}`),
    ]);

    console.log(`  EN size: ${enHtml.length}, CN size: ${cnHtml.length}`);

    // 方法1：通过 data-modifier-id 匹配
    const enById = extractByModifierId(enHtml);
    const cnById = extractByModifierId(cnHtml);

    console.log(
      `  Method 1 - EN modifier IDs: ${enById.size}, CN modifier IDs: ${cnById.size}`,
    );

    const translations = {};

    // 通过 modifier ID 匹配
    enById.forEach((enText, id) => {
      if (cnById.has(id)) {
        const cnText = cnById.get(id);
        if (enText && cnText && enText !== cnText) {
          // 验证是否为有效翻译（长度相似，不是纯数字等）
          const enLen = enText.replace(/[0-9.\-–—()%]/g, "").length;
          const cnLen = cnText.replace(/[0-9\u4e00-\u9fa5]/g, "").length;

          if (enLen > 3 && cnLen > 0) {
            translations[enText] = cnText;
          }
        }
      }
    });

    // 方法2：通过 href 匹配（用于装备名称等）
    const enByHref = extractByHref(enHtml);
    const cnByHref = extractByHref(cnHtml);

    console.log(
      `  Method 2 - EN hrefs: ${enByHref.size}, CN hrefs: ${cnByHref.size}`,
    );

    enByHref.forEach((enName, href) => {
      if (cnByHref.has(href)) {
        const cnName = cnByHref.get(href);
        if (cnName && enName !== cnName && !translations[enName]) {
          translations[enName] = cnName;
        }
      }
    });

    console.log(`  ✅ Total matched: ${Object.keys(translations).length}`);

    // 保存
    const outDir = path.join(__dirname, "../src/data/translated-affixes");
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(outDir, `${page.name.toLowerCase()}-translations.json`),
      JSON.stringify(translations, null, 2),
      "utf-8",
    );

    return Object.keys(translations).length;
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return 0;
  }
}

async function main() {
  console.log("🚀 Starting proper scrape...\n");

  const outDir = path.join(__dirname, "../src/data/translated-affixes");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  let total = 0;

  for (const page of PAGES) {
    const count = await scrapePage(page);
    total += count;
  }

  console.log("\n=================================================");
  console.log(`✅ Total translations scraped: ${total}`);
  console.log("=================================================\n");

  console.log(
    "Now merging all translations into complete-affix-translations.ts...\n",
  );

  // 合并所有翻译
  const allTranslations = {};
  const translationFiles = fs
    .readdirSync(outDir)
    .filter(
      (f) =>
        f.endsWith("-translations.json") &&
        !f.startsWith("complete-") &&
        !f.startsWith("all-"),
    );

  translationFiles.forEach((file) => {
    const data = JSON.parse(fs.readFileSync(path.join(outDir, file), "utf8"));
    Object.assign(allTranslations, data);
    console.log(`✅ ${file}: ${Object.keys(data).length} translations`);
  });

  // 保存合并文件
  fs.writeFileSync(
    path.join(outDir, "all-website-translations.json"),
    JSON.stringify(allTranslations, null, 2),
    "utf-8",
  );

  console.log(
    `\n✅ Total merged: ${Object.keys(allTranslations).length} translations`,
  );
  console.log("\n✅ All done!");
}

main().catch(console.error);
