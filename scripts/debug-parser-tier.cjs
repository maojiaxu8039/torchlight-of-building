const https = require("https");
const http = require("http");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const request = client.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });
    request.on("error", reject);
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error(`Timeout: ${url}`));
    });
  });
}

function parseModifiers(html) {
  const modifiers = {};

  // Match from data-tier to next data-tier or end
  const regex = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<\/span>([^<]*)/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const modifierId = match[1];
    const textMod = match[2];
    const suffix = match[3];

    let valueText = textMod.replace(/<[^>]+>/g, "");
    valueText = valueText.replace(/&ndash;/g, "-");
    valueText = valueText.replace(/&amp;/g, "&");

    let fullText = valueText + suffix;
    fullText = fullText.replace(/\s+/g, " ").trim();
    fullText = fullText.replace(/&nbsp;/g, " ");
    fullText = fullText.replace(/\u2013/g, "-");
    fullText = fullText.replace(/\u2014/g, "-");

    // Find the tier for this modifier by looking backward
    // Extract tier from nearby data-tier attribute
    const beforeMatch = html.substring(
      Math.max(0, match.index - 500),
      match.index,
    );
    const tierMatch = beforeMatch.match(/data-tier="(\d+)"/);
    const tier = tierMatch ? tierMatch[1] : "0";

    if (fullText) {
      modifiers[modifierId] = { tier, text: fullText };
    }
  }

  return modifiers;
}

async function main() {
  console.log("🔍 Testing Tier parser...\n");

  const html = await fetchUrl("https://tlidb.com/en/Belt");
  const modifiers = parseModifiers(html);

  console.log(`Found ${Object.keys(modifiers).length} EN modifiers\n`);

  console.log("Sample EN modifiers:");
  Object.entries(modifiers)
    .slice(0, 10)
    .forEach(([id, data]) => {
      console.log(`  [${id}] Tier ${data.tier}: ${data.text}`);
    });

  // Test CN page
  console.log("\n📦 CN page:");
  const cnHtml = await fetchUrl("https://tlidb.com/cn/Belt");
  const cnModifiers = parseModifiers(cnHtml);

  console.log(`Found ${Object.keys(cnModifiers).length} CN modifiers\n`);

  // Match and show
  console.log("Matching:");
  let matched = 0;
  Object.entries(modifiers).forEach(([id, enData]) => {
    if (cnModifiers[id]) {
      matched++;
      if (matched <= 5) {
        console.log(`✅ [${id}] Tier ${enData.tier}:`);
        console.log(`   EN: ${enData.text}`);
        console.log(`   CN: ${cnModifiers[id].text}`);
      }
    }
  });

  console.log(`\nTotal matched: ${matched} / ${Object.keys(modifiers).length}`);
}

main().catch(console.error);
