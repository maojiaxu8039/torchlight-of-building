const https = require("https");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(data);
        });
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

async function main() {
  console.log("=== 检查 Belt 网页上的词缀 ===\n");

  const html = await fetchUrl("https://tlidb.com/en/Belt");

  // 查找 Fire Resistance
  const matches = [];
  const pattern = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<\/span>/gi;
  let match;

  while ((match = pattern.exec(html)) !== null) {
    const text = match[2]
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (
      text.includes("Fire Resistance") ||
      text.includes("Cold Resistance") ||
      text.includes("Lightning Resistance")
    ) {
      matches.push(text);
    }
  }

  console.log("找到 " + matches.length + " 个相关词缀:");
  matches.forEach((m) => {
    console.log("  " + m);
  });
}

main();
