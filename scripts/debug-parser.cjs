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

function parseModifiers(html) {
  const modifiers = {};

  const trRegex = /<tr[^>]*data-tier[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch;

  while ((trMatch = trRegex.exec(html)) !== null) {
    const row = trMatch[0];

    const idMatch = row.match(/data-modifier-id="(\d+)"/);
    if (!idMatch) continue;

    const modifierId = idMatch[1];

    const firstTdMatch = row.match(/<td[^>]*>([\s\S]*?)<\/td>/i);
    if (!firstTdMatch) continue;

    let text = firstTdMatch[1];

    text = text.replace(
      /<span[^>]*data-modifier-id="\d+"[^>]*>([\s\S]*?)<\/span>/gi,
      "$1",
    );
    text = text.replace(/<i[^>]*>[\s\S]*?<\/i>/gi, "");
    text = text.replace(/<[^>]+>/g, " ");
    text = text.replace(/&nbsp;/g, " ");
    text = text.replace(/&ndash;/g, "-");
    text = text.replace(/&amp;/g, "&");
    text = text.replace(/&#39;/g, "'");
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/\u2013/g, "-");
    text = text.replace(/\u2014/g, "-");
    text = text.replace(/\s+/g, " ").trim();

    if (text) {
      modifiers[modifierId] = text;
    }
  }

  return modifiers;
}

async function main() {
  console.log("🔍 Testing parser...\n");

  const html = await fetchUrl("https://tlidb.com/en/Belt");
  const modifiers = parseModifiers(html);

  console.log(`Found ${Object.keys(modifiers).length} modifiers\n`);

  console.log("Sample modifiers:");
  Object.entries(modifiers)
    .slice(0, 10)
    .forEach(([id, text]) => {
      console.log(`  [${id}] ${text}`);
    });

  // Test CN page
  console.log("\nCN page:");
  const cnHtml = await fetchUrl("https://tlidb.com/cn/Belt");
  const cnModifiers = parseModifiers(cnHtml);

  console.log(`Found ${Object.keys(cnModifiers).length} CN modifiers\n`);

  // Match and show
  let matched = 0;
  Object.entries(modifiers).forEach(([id, enText]) => {
    if (cnModifiers[id]) {
      matched++;
      if (matched <= 10) {
        console.log(`✅ ${enText} → ${cnModifiers[id]}`);
      }
    } else {
      console.log(`❌ No CN for: ${enText}`);
    }
  });

  console.log(`\nTotal matched: ${matched}`);
}

main().catch(console.error);
