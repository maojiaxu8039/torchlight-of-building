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
  console.log("🔍 Exhaustively testing equipment URLs...\n");

  const allUrls = [
    // Complete list of equipment names from game
    "One_Hand_Axe",
    "One_Hand_Hammer",
    "One_Hand_Sword",
    "Two_Hand_Axe",
    "Two_Hand_Hammer",
    "Two_Hand_Sword",
    "1HAxe",
    "1HHammer",
    "1HSword",
    "2HAxe",
    "2HHammer",
    "2HSword",
    "OneHand_Axe",
    "OneHand_Hammer",
    "OneHand_Sword",
    "TwoHand_Axe",
    "TwoHand_Hammer",
    "TwoHand_Sword",
    "Class1_Axe",
    "Class1_Hammer",
    "Class1_Sword",
    "Class2_Axe",
    "Class2_Hammer",
    "Class2_Sword",
    "DEX_Axe",
    "DEX_Hammer",
    "DEX_Sword",
    "INT_Axe",
    "INT_Hammer",
    "INT_Sword",
    "STR_Axe",
    "STR_Hammer",
    "STR_Sword",
    "Melee_Weapon",
    "Ranged_Weapon",
    "Magic_Weapon",
    "Physical_Weapon",
    "One_Hand_Weapon",
    "Two_Hand_Weapon",
    // Chest variations
    "Chest",
    "Armor",
    "BodyArmor",
    "ChestArmor",
    "TorsoArmor",
    "Body",
    "Body_Armor",
    "Cloth_Armor",
    "Leather_Armor",
    "Chain_Armor",
    "Plate_Armor",
    "STR_Armor",
    "DEX_Armor",
    "INT_Armor",
    // Alternative names
    "Blade",
    "Mace",
    "Axe",
    "Hammer",
    "Sword",
  ];

  console.log(`Testing ${allUrls.length} URL variants...\n`);

  let foundCount = 0;
  for (const url of allUrls) {
    const result = await testUrl(`https://tlidb.com/en/${url}`);
    if (result.count > 0) {
      console.log(`✅ /en/${url}: ${result.count} modifiers`);
      foundCount++;
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Found ${foundCount} working URLs out of ${allUrls.length}`);
}

main().catch(console.error);
