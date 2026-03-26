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
  console.log("=== 检查 Belt 网页上的 Fire Resistance ===\n");
  
  const html = await fetchUrl("https://tlidb.com/en/Belt");
  
  // 查找包含 Fire Resistance 的 <td> 单元格
  const pattern = /<td><span data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<\/span><\/td>/gi;
  let match;
  
  console.log("Fire Resistance 相关词缀:");
  while ((match = pattern.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&ndash;/g, "-").replace(/\s+/g, " ").trim();
    if (text.includes("Fire Resistance")) {
      console.log("  ID: " + match[1]);
      console.log("  EN: " + text);
    }
  }
}

main();
