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
  console.log("=== 检查 EN 网页内容 ===\n");
  
  const html = await fetchUrl("https://tlidb.com/en/Belt");
  
  // 查找包含 Elemental Resistance 的内容
  const lines = html.split("\n");
  let count = 0;
  
  for (const line of lines) {
    if (line.includes("Elemental Resistance") || line.includes("avoid Elemental")) {
      console.log(line.substring(0, 200));
      count++;
      if (count > 5) break;
    }
  }
  
  if (count === 0) {
    console.log("没有找到 Elemental Resistance 或 avoid Elemental");
  }
}

main();
