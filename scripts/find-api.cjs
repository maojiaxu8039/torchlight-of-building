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

async function checkApi() {
  console.log("=== Checking for API endpoints ===\n");

  const html = await fetchUrl("https://tlidb.com/en/Confusion_Card_Library");

  // 查找 API 请求
  const apiPatterns = [
    /api\/[^\s"']+/gi,
    /\/data\/[^\s"']+/gi,
    /fetch\(['"]([^'"]+)['"]/gi,
    /axios\.[a-z]+\(['"]([^'"]+)['"]/gi,
  ];

  const found = new Set();

  apiPatterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      found.add(match[1]);
    }
  });

  console.log("Found potential API endpoints:");
  found.forEach((endpoint) => console.log(`  - ${endpoint}`));

  // 检查 script 标签中的数据
  const scriptPattern = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let count = 0;

  while ((match = scriptPattern.exec(html)) !== null && count < 5) {
    const content = match[1];
    if (content.includes("modifier") || content.includes("Confusion")) {
      console.log(`\nScript ${count + 1} (${content.length} chars):`);
      console.log(content.substring(0, 500));
      count++;
    }
  }
}

checkApi();
