const https = require("https");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

async function main() {
  console.log("=== 检查网页内容 ===\n");

  const enHtml = await fetchUrl("https://tlidb.com/en/Belt");
  const cnHtml = await fetchUrl("https://tlidb.com/cn/Belt");

  // 查找包含 Elemental Resistance 的词条
  const enPattern = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<\/span>/gi;
  const cnPattern = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<\/span>/gi;

  console.log("EN 网页包含 Elemental Resistance:");
  let match;
  let count = 0;
  while ((match = enPattern.exec(enHtml)) !== null && count < 10) {
    const text = match[2]
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (
      text.includes("Elemental Resistance") ||
      text.includes("avoid Elemental")
    ) {
      console.log(`  ${text.substring(0, 100)}`);
      count++;
    }
  }

  console.log("\nCN 网页包含 元素抗性 或 避免元素:");
  count = 0;
  while ((match = cnPattern.exec(cnHtml)) !== null && count < 10) {
    const text = match[2]
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (
      text.includes("元素抗性") ||
      text.includes("避免元素") ||
      text.includes("Elemental")
    ) {
      console.log(`  ${text.substring(0, 100)}`);
      count++;
    }
  }
}

main();
