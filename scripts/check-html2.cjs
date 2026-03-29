const https = require("https");
const http = require("http");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const request = client.get(url, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
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
  console.log("🔍 检查 HTML 结构...\n");

  const html = await fetchUrl("https://tlidb.com/en/Wand");
  
  console.log(`HTML 长度: ${html.length}\n`);
  
  // 搜索 "Adds"
  if (html.includes("Adds")) {
    console.log("✅ 找到 'Adds'");
    const idx = html.indexOf("Adds");
    console.log(html.substring(Math.max(0, idx - 100), idx + 200));
  } else {
    console.log("❌ 没有找到 'Adds'");
  }
  
  // 搜索 "Spell"
  if (html.includes("Spell Damage")) {
    console.log("\n✅ 找到 'Spell Damage'");
    const idx = html.indexOf("Spell Damage");
    console.log(html.substring(Math.max(0, idx - 100), idx + 200));
  }
  
  // 检查 data-modifier-id 结构
  const modMatches = html.match(/data-modifier-id="(\d+)"/g);
  console.log(`\n找到 ${modMatches ? modMatches.length : 0} 个 data-modifier-id`);
  
  // 检查 data-tier 结构
  const tierMatches = html.match(/data-tier="(\d+)"/g);
  console.log(`找到 ${tierMatches ? tierMatches.length : 0} 个 data-tier`);
}

main().catch(console.error);
