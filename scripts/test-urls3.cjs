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
  const equipmentTests = [
    // One/Two Handed Weapons
    "One_Handed_Axe",
    "One_Handed_Hammer",
    "One_Handed_Sword",
    "Two_Handed_Axe",
    "Two_Handed_Hammer",
    "Two_Handed_Sword",
    "Axe",
    "Hammer",
    "Sword",
    // Chest/Armor
    "Armor",
    "ClothArmor",
    "LeatherArmor",
    "ChainArmor",
    "PlateArmor",
    "Robe",
    "Vest",
    " DEX_Boots",
    // Gloves variations
    " DEX_Gloves",
    // Helmet variations
    " DEX_Helmet",
    // Shield variations
    " DEX_Shield",
    // More
    "weapon/DEX_Bow",
    "equipment/Bow",
    "item/Bow",
  ];

  console.log("🔍 Testing more URL formats...\n");

  const results = [];

  for (const eq of equipmentTests) {
    const result = await testUrl(`https://tlidb.com/en/${eq}`);
    results.push(result);
    if (result.count > 0 || result.error) {
      console.log(
        `${result.count > 0 ? "✅" : "❌"} ${eq}: ${result.count > 0 ? `${result.count} modifiers` : result.error || "no data"}`,
      );
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("\n✅ Working URLs (count > 0):");
  results
    .filter((r) => r.count > 0)
    .forEach((r) => {
      console.log(`   ${r.url}: ${r.count} modifiers`);
    });
}

main().catch(console.error);
