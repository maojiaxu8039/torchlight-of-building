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
  console.log("=== 检查 Belt 网页 HTML 结构 ===\n");

  const html = await fetchUrl("https://tlidb.com/en/Belt");

  // 查找 Fire Resistance 附近的 HTML
  const idx = html.indexOf("Fire Resistance");
  if (idx !== -1) {
    console.log("Fire Resistance 附近的内容:");
    console.log(html.substring(Math.max(0, idx - 200), idx + 200));
  }
}

main();
