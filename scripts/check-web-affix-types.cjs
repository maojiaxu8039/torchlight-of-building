const https = require("https");

function fetchUrl(url) {
  return new Promise(function(resolve, reject) {
    https.get(url, function(res) {
      let data = "";
      res.on("data", function(chunk) { data += chunk; });
      res.on("end", function() { resolve(data); });
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function main() {
  console.log("=== 检查 Belt 网页上的词缀类型 ===\n");
  
  const html = await fetchUrl("https://tlidb.com/en/Belt");
  
  // 查找所有锚点
  const anchorRegex = /id="([^"]+)"/g;
  const anchors = [];
  let match;
  
  while ((match = anchorRegex.exec(html)) !== null) {
    if (match[1] && !match[1].startsWith("Item")) {
      anchors.push(match[1]);
    }
  }
  
  console.log("锚点列表:");
  anchors.forEach(a => console.log("  - " + a));
}

main();
