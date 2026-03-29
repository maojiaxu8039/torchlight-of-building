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

async function main() {
  console.log("🔍 Checking tlidb.com structure for equipment URLs...\n");

  try {
    const result = await fetchUrl("https://tlidb.com/en/Bow");

    // Look for navigation links or equipment lists
    const linkRegex = /href="\/en\/([^"]+)"/g;
    const links = new Set();
    let match;
    while ((match = linkRegex.exec(result.data)) !== null) {
      links.add(match[1]);
    }

    console.log("Found links on Bow page:");
    const linkArray = Array.from(links).sort();
    linkArray.forEach((link) => {
      console.log(`   /en/${link}`);
    });

    // Also look for equipment category links
    const categoryRegex = /class="[^"]*item[^"]*"[^>]*href="([^"]+)"/gi;
    console.log("\nEquipment links:");
    while ((match = categoryRegex.exec(result.data)) !== null) {
      console.log(`   ${match[1]}`);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main().catch(console.error);
