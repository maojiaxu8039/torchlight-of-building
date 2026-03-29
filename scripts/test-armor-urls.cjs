const https = require("https");
const http = require("http");

function fetchUrl(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const request = client.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, data }));
    });
    request.on("error", reject);
    request.setTimeout(timeout, () => {
      request.destroy();
      reject(new Error(`Timeout: ${url}`));
    });
  });
}

async function testUrl(url) {
  try {
    const result = await fetchUrl(url);
    const regex = /data-modifier-id="(\d+)"/g;
    const matches = [];
    let match;
    while ((match = regex.exec(result.data)) !== null) {
      matches.push(match[1]);
    }
    return { url, status: result.status, count: matches.length };
  } catch (error) {
    return { url, error: error.message };
  }
}

async function main() {
  console.log("🔍 Testing armor/chest URL formats...\n");

  const armorTests = [
    // Common names
    "Torso",
    "Body",
    "Vest",
    "Plate",
    // Class-based names
    "STR_Chest",
    "DEX_Chest",
    "INT_Chest",
    "Str_Chest",
    "Dex_Chest",
    "Int_Chest",
    // With hyphen
    "STR-Chest",
    "DEX-Chest",
    "INT-Chest",
    // Alternative names
    "ChestArmor",
    "Chest-Armor",
    "Body-Armor",
    "Torso-Armor",
    // Full armor names
    "Leather-Armor",
    "Chain-Armor",
    "Plate-Armor",
    "Cloth-Armor",
    // Game-specific
    "Helmet-Str",
    "Gloves-Str",
    "Boots-Str",
    "Shield-Str",
  ];

  for (const armor of armorTests) {
    const result = await testUrl(`https://tlidb.com/en/${armor}`);
    const status = result.count > 0 ? "✅" : "❌";
    const info =
      result.count > 0
        ? `${result.count} modifiers`
        : result.error || "no data";
    console.log(`${status} ${armor}: ${info}`);
  }
}

main().catch(console.error);
