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
  console.log("🔍 Testing weapon URL formats...\n");

  const weaponTests = [
    // One-Handed (confirmed: One-Handed_Sword works)
    "One-Handed_Sword",
    "One-Handed_Axe",
    "One-Handed_Hammer",
    "One-Handed_Dagger",
    // Two-Handed
    "Two-Handed_Sword",
    "Two-Handed_Axe",
    "Two-Handed_Hammer",
    // Chest/Armor
    "Chest",
    "Armor",
    "Body_Armor",
    "Cloth_Armor",
    "Leather_Armor",
    "Chain_Armor",
    "Plate_Armor",
    "Heavy_Armor",
  ];

  for (const weapon of weaponTests) {
    const result = await testUrl(`https://tlidb.com/en/${weapon}`);
    const status = result.count > 0 ? "✅" : "❌";
    const info =
      result.count > 0
        ? `${result.count} modifiers`
        : result.error || "no data";
    console.log(`${status} ${weapon}: ${info}`);
  }
}

main().catch(console.error);
