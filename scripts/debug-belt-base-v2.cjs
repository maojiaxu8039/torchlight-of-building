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
  const enHtml = await fetchUrl("https://tlidb.com/en/Belt#Item");

  console.log("检查 BeltBaseAffix 位置:");
  const idx = enHtml.indexOf('id="BeltBaseAffix"');
  console.log("第一次出现:", idx);

  if (idx !== -1) {
    console.log("\n附近内容:");
    console.log(enHtml.substring(idx, idx + 200));
  }
}

main();
