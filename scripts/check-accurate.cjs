const https = require("https");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(data));
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function main() {
  console.log("=== 检查网页内容 ===\n");
  
  const html = await fetchUrl("https://tlidb.com/en/Belt");
  
  // 直接搜索关键词
  console.log("包含 'Elemental Resistance': " + (html.includes("Elemental Resistance") ? "是" : "否");
  console.log("包含 'Elemental Ailment': " + (html.includes("Elemental Ailment") ? "是" : "否");
  
  // 搜索包含 Elemental 的词条
  const lines = html.split("\n");
  let count = 0;
  console.log("\n包含 'Elemental' 的行:");
  lines.forEach(function(line) {
    if (line.includes("Elemental")) {
      console.log(line.substring(0, 150));
      count++;
      if (count > 10) {
        console.log("...");
        return;
      }
    }
  });
  
  if (count === 0) {
    console.log("未找到包含 Elemental 的行");
  }
}

main();
