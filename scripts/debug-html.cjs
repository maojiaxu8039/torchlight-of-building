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
  console.log("🔍 Checking HTML structure...\n");

  const html = await fetchUrl("https://tlidb.com/en/Belt");

  const regex = /data-modifier-id="(\d+)"/g;
  const matches = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    matches.push(match[1]);
  }

  console.log(`Found ${matches.length} data-modifier-id attributes\n`);

  // Find a few examples of the HTML structure
  const tableMatch = html.match(
    /<table[^>]*class="[^"]*DataTable[^"]*"[^>]*>[\s\S]{0,2000}<\/table>/i,
  );
  if (tableMatch) {
    console.log("Sample table HTML:");
    console.log(tableMatch[0].substring(0, 2000));
  }
}

main().catch(console.error);
