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
  console.log("🔍 Checking Tier distribution...\n");

  const html = await fetchUrl("https://tlidb.com/en/Belt");
  const modifiers = parseModifiers(html);

  const tierCounts = {};
  Object.values(modifiers).forEach((data) => {
    tierCounts[data.tier] = (tierCounts[data.tier] || 0) + 1;
  });

  console.log("Tier distribution:");
  Object.entries(tierCounts).forEach(([tier, count]) => {
    console.log(`  Tier ${tier}: ${count}`);
  });

  console.log("\nSample modifiers by tier:");
  const byTier = {};
  Object.entries(modifiers).forEach(([id, data]) => {
    if (!byTier[data.tier]) byTier[data.tier] = [];
    byTier[data.tier].push({ id, text: data.text });
  });

  Object.keys(byTier)
    .sort()
    .forEach((tier) => {
      console.log(`\nTier ${tier} (${byTier[tier].length}):`);
      byTier[tier].slice(0, 3).forEach((m) => {
        console.log(`  [${m.id}] ${m.text}`);
      });
    });
}

main().catch(console.error);
