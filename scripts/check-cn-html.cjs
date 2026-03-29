const https = require("https");
const http = require("http");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const request = client.get(url, (res) => {
      console.log(`Status: ${res.statusCode}`);
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
  console.log("🔍 Checking CN HTML structure...\n");

  try {
    const html = await fetchUrl("https://tlidb.com/cn/Belt");
    console.log(`HTML length: ${html.length}`);
    
    // 检查 data-modifier-id
    const modMatches = html.match(/data-modifier-id="(\d+)"/g);
    console.log(`data-modifier-id count: ${modMatches ? modMatches.length : 0}`);
    
    // 检查中文内容
    if (html.includes("最大生命")) {
      console.log("✅ 找到 '最大生命'");
    }
    
    // 打印一段包含数据的 HTML
    const sampleIdx = html.indexOf("data-modifier-id");
    if (sampleIdx > 0) {
      console.log("\nSample HTML:");
      console.log(html.substring(sampleIdx - 100, sampleIdx + 200));
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
