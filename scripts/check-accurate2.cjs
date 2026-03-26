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
  console.log("=== 检查网页内容 ===\n");
  
  const html = await fetchUrl("https://tlidb.com/en/Belt");
  
  const hasResistance = html.includes("Elemental Resistance");
  const hasAilment = html.includes("Elemental Ailment");
  
  console.log("包含 'Elemental Resistance': " + (hasResistance ? "是" : "否"));
  console.log("包含 'Elemental Ailment': " + (hasAilment ? "是" : "否"));
}

main();
