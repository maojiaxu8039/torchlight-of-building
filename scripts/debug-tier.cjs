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
  console.log("🔍 Debugging Tier parsing...\n");

  const html = await fetchUrl("https://tlidb.com/en/Belt");

  const sample = html.substring(
    html.indexOf("data-tier"),
    html.indexOf("data-tier") + 500,
  );
  console.log("Sample around data-tier:");
  console.log(sample);

  console.log("\n" + "=".repeat(60));

  const trMatches = html.match(/<tr[^>]*>/gi);
  console.log(`Total <tr> tags: ${trMatches ? trMatches.length : 0}`);

  const dataTierMatches = html.match(/data-tier="[^"]*"/gi);
  console.log(
    `Total data-tier attributes: ${dataTierMatches ? dataTierMatches.length : 0}`,
  );

  if (dataTierMatches) {
    console.log("\nFirst 5 data-tier values:");
    dataTierMatches
      .slice(0, 5)
      .forEach((m, i) => console.log(`  ${i + 1}: ${m}`));
  }
}

main().catch(console.error);
