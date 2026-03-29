import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES = [
  { url: "Craft", name: "Craft" },
  { url: "Legendary_Gear", name: "Legendary" },
  { url: "Talent", name: "Talent" },
  { url: "Active_Skill", name: "Active" },
  { url: "Support_Skill", name: "Support" },
  { url: "Passive_Skill", name: "Passive" },
  { url: "Activation_Medium_Skill", name: "Activation" },
  { url: "Noble_Support_Skill", name: "Noble" },
  { url: "Magnificent_Support_Skill", name: "Magnificent" },
  { url: "Hero", name: "Hero" },
  { url: "Pactspirit", name: "Pactspirit" },
  { url: "Ethereal_Prism", name: "Prism" },
  { url: "Destiny", name: "Destiny" },
  { url: "Corrosion", name: "Corrosion" },
  { url: "Dream_Talking", name: "Dream" },
  { url: "Blending_Rituals", name: "Blending" },
  { url: "TOWER_Sequence", name: "Tower" },
  { url: "Graft", name: "Graft" },
];

async function fetch(url: string): Promise<string> {
  const res = await fetch(url);
  return res.ok ? res.text() : "";
}

async function scrapePage(page: { url: string; name: string }): Promise<void> {
  const [enHtml, cnHtml] = await Promise.all([
    fetch(`https://tlidb.com/en/${page.url}`),
    fetch(`https://tlidb.com/cn/${page.url}`),
  ]);

  const translations: Record<string, string> = {};

  // Extract from CN page with modifier-id
  const $ = cheerio.load(cnHtml);
  const cnByModifier = new Map<string, string>();

  $("tr").each((_, tr) => {
    const $tr = $(tr);
    const $span = $tr.find("[data-modifier-id]");
    const $td = $tr.find("td").last();

    if ($span.length && $td.length) {
      const id = $span.attr("data-modifier-id");
      const cnText = $td.text().trim();
      if (id && cnText) cnByModifier.set(id, cnText);
    }
  });

  // Match with EN page
  const $en = cheerio.load(enHtml);
  $en("tr").each((_, tr) => {
    const $tr = $en(tr);
    const $span = $tr.find("[data-modifier-id]");
    const $td = $tr.find("td").last();

    if ($span.length && $td.length) {
      const id = $span.attr("data-modifier-id");
      const enText = $td.text().trim();

      if (id && enText && cnByModifier.has(id)) {
        translations[enText] = cnByModifier.get(id)!;
      }
    }
  });

  // Also try data-hover
  $("a[data-hover]").each((_, elem) => {
    const href = $(elem).attr("href");
    const cnText = $(elem).text().trim();
    if (href && cnText && !translations[href]) {
      translations[href] = cnText;
    }
  });

  console.log(
    `✅ ${page.name}: ${Object.keys(translations).length} translations`,
  );

  // Save
  const outDir = path.join(__dirname, "../src/data/translated-affixes");
  fs.writeFileSync(
    path.join(outDir, `${page.name.toLowerCase()}-translations.json`),
    JSON.stringify(translations, null, 2),
    "utf-8",
  );
}

async function main() {
  console.log("🚀 Starting fast scrape...\n");

  const outputDir = path.join(__dirname, "../src/data/translated-affixes");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  await Promise.all(PAGES.map((p) => scrapePage(p)));

  console.log("\n✅ All done!");
}

main().catch(console.error);
