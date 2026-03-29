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
    // More weapon variants
    "Axe",
    "Hammer",
    "Sword",
    "One_Handed_Axe",
    "One_Handed_Hammer",
    "One_Handed_Sword",
    "Two_Handed_Axe",
    "Two_Handed_Hammer",
    "Two_Handed_Sword",
    "1H_Axe",
    "1H_Hammer",
    "1H_Sword",
    "2H_Axe",
    "2H_Hammer",
    "2H_Sword",
    "OneHand_Axe",
    "OneHand_Hammer",
    "OneHand_Sword",
    "TwoHand_Axe",
    "TwoHand_Hammer",
    "TwoHand_Sword",
    // Armor
    "BodyArmor",
    "Torso",
    "Plate",
    "ClothArmor",
    "LeatherArmor",
    "MailArmor",
    "PlateArmor",
    // FireCannon alternatives
    "Cannon",
    "Fire_Cannon",
    "FlameCannon",
    "Flame_Cannon",
    // SpiritRing alternatives
    "Spirit",
    "Spirit_Ring",
    "SoulRing",
    "Soul_Ring",
    // Gloves
    "Gloves",
    // Boots
    "Boots",
    // Helmet
    "Helmet",
    // Shield
    "Shield",
    // Possible complete URLs from tlidb
    "DEX/Boots",
    "DEX_Boots",
    "class/DEX_Boots",
    "equipment/DEX_Boots",
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
