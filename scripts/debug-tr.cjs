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

async function main() {
  console.log("🔍 Debugging TR structure...\n");

  const html = await fetchUrl("https://tlidb.com/en/Belt");

  const regex = /<tr[^>]*data-tier="(\d+)"[^>]*>([\s\S]*?)<\/tr>/gi;
  let match;
  let count = 0;

  while ((match = regex.exec(html)) !== null) {
    const tier = match[1];
    const content = match[2];
    console.log(`\nTier ${tier}:`);
    console.log(content.substring(0, 300));
    count++;
    if (count >= 3) break;
  }

  console.log(`\nTotal matches: ${count}`);
}

main().catch(console.error);
