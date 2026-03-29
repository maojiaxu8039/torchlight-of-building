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

  // 找到 Base Affix 部分
  const baseMatch = enHtml.match(
    /Base Affix([\s\S]*?)(?=Pre-fix|Suffix|Tower|$)/i,
  );

  if (baseMatch) {
    console.log("找到 Base Affix 部分，长度:", baseMatch[1].length);

    // 提取前 500 个字符
    console.log("\n内容预览:");
    console.log(baseMatch[1].substring(0, 500));
  } else {
    console.log("未找到 Base Affix 部分");

    // 尝试其他方式
    const idx = enHtml.indexOf("Base Affix");
    if (idx !== -1) {
      console.log("\nBase Affix 位置:", idx);
      console.log("\n附近内容:");
      console.log(enHtml.substring(idx, idx + 500));
    }
  }
}

main();
