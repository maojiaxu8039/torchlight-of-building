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
    // Chest/Armor
    "ChestArmor",
    "Chest",
    "Body",
    "Armor",
    "Chest_Armor",
    "DEX_ChestArmor",
    "INT_ChestArmor",
    "STR_ChestArmor",
    // Weapons
    "Bow",
    "Crossbow",
    "Musket",
    "Pistol",
    "Wand",
    "Rod",
    "Scepter",
    "Dagger",
    "OneHandedAxe",
    "OneHandedHammer",
    "OneHandedSword",
    "TwoHandedAxe",
    "TwoHandedHammer",
    "TwoHandedSword",
    "Cudgel",
    "Claw",
    "Cane",
    "TinStaff",
    "FireCannon",
    // Accessories
    "Necklace",
    "Ring",
    "SpiritRing",
    "Belt",
    // Full paths
    "DEX_Bow",
    "DEX_Crossbow",
    "DEX_Musket",
    "DEX_Pistol",
    "INT_Wand",
    "INT_Rod",
    "INT_Scepter",
    "INT_TinStaff",
    "STR_Dagger",
    "STR_OneHandedAxe",
    "STR_OneHandedHammer",
    "STR_OneHandedSword",
    "STR_TwoHandedAxe",
    "STR_TwoHandedHammer",
    "STR_TwoHandedSword",
    "STR_Cudgel",
    "STR_Claw",
    "INT_Cane",
    // Alternative names
    "Staff",
    "Stave",
    "Tin_Staff",
    "OneHand_Axe",
    "1H_Axe",
    "2H_Axe",
  ];

  console.log("🔍 Testing URL formats on tlidb.com...\n");

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

  console.log("\n❌ Not working (count = 0 or error):");
  results
    .filter((r) => !r.count && !r.error)
    .forEach((r) => {
      console.log(`   ${r.url}`);
    });
}

main().catch(console.error);
