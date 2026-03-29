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
  const html = await fetchUrl("https://tlidb.com/en/Belt");

  // 查找包含 Elemental Resistance 的上下文
  const idx = html.indexOf("Elemental Resistance");
  if (idx !== -1) {
    console.log("找到 Elemental Resistance 在位置 " + idx);
    console.log("上下文:");
    console.log(html.substring(Math.max(0, idx - 100), idx + 200));
  }

  // 查找 data-modifier-id 的结构
  const pattern = /data-modifier-id="(\d+)"/g;
  let match;
  let count = 0;
  while ((match = pattern.exec(html)) !== null && count < 3) {
    console.log("\n找到 data-modifier-id: " + match[1]);
    count++;
  }
}

main();
