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
  console.log("🔍 Checking Craft page for equipment URLs...\n");

  try {
    const result = await fetchUrl("https://tlidb.com/en/Craft");

    // Look for specific equipment links in the page
    const equipRegex =
      /href="\/en\/([^"]*(?:Boots|Gloves|Helmet|Chest|Shield|Bow|Crossbow|Musket|Pistol|Wand|Rod|Scepter|Dagger|Axe|Hammer|Sword|Cudgel|Claw|Cane|Staff|Cannon|Ring|Necklace|Belt)[^"]*)"/gi;
    const links = new Set();
    let match;
    while ((match = equipRegex.exec(result.data)) !== null) {
      links.add(match[1]);
    }

    console.log("Found equipment links on Craft page:");
    const linkArray = Array.from(links).sort();
    if (linkArray.length > 0) {
      linkArray.forEach((link) => {
        console.log(`   /en/${link}`);
      });
    } else {
      console.log("   No direct equipment links found.");
    }

    // Also check Inventory page
    console.log("\n🔍 Checking Inventory page...\n");
    const invResult = await fetchUrl("https://tlidb.com/en/Inventory");

    const invLinks = new Set();
    while ((match = equipRegex.exec(invResult.data)) !== null) {
      invLinks.add(match[1]);
    }

    console.log("Found equipment links on Inventory page:");
    const invArray = Array.from(invLinks).sort();
    if (invArray.length > 0) {
      invArray.forEach((link) => {
        console.log(`   /en/${link}`);
      });
    } else {
      console.log("   No direct equipment links found.");
    }

    // Test more variants
    console.log("\n🔍 Testing more URL variants...\n");

    const variants = [
      "One_Hand_Axe",
      "One_Hand_Hammer",
      "One_Hand_Sword",
      "Two_Hand_Axe",
      "Two_Hand_Hammer",
      "Two_Hand_Sword",
      "One_Handed",
      "Two_Handed",
      "OneHand",
      "TwoHand",
      "Body",
      "Torso",
      "Armor",
      "Cloth",
      "Leather",
      "Chain",
      "Plate",
      "Shield",
    ];

    for (const v of variants) {
      const testResult = await testUrl(`https://tlidb.com/en/${v}`);
      if (testResult.count > 0) {
        console.log(`✅ Found: /en/${v}: ${testResult.count} modifiers`);
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main().catch(console.error);
