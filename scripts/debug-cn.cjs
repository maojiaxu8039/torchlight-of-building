const https = require("https");
const http = require("http");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const request = client.get(url, (res) => {
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
  console.log("🔍 Testing CN HTML matching\n");
  
  const html = await fetchUrl("https://tlidb.com/cn/Belt");
  
  const idRegex = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)(?=<i\s|data-modifier-id="|$)/gi;
  let idMatch;
  let count = 0;

  while ((idMatch = idRegex.exec(html)) !== null) {
    const modifierId = idMatch[1];
    let text = idMatch[2];
    
    if (modifierId === "1502300") {
      console.log(`ID: ${modifierId}`);
      console.log(`Raw text: ${text.substring(0, 200)}`);
      
      // 清理文本
      text = text
        .replace(/data-bs-title="[^"]*"/g, '')
        .replace(/data-bs-html="[^"]*"/g, '')
        .replace(/data-bs-toggle="[^"]*"/g, '')
        .replace(/<div[^>]*>/g, '')
        .replace(/<\/div>/g, '')
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<i[^>]*>.*?<\/i>/gi, '')
        .replace(/<e[^>]*>([^<]*)<\/e>/gi, '$1')
        .replace(/<a[^>]*>([^<]*)<\/a>/gi, '$1')
        .replace(/<span[^>]*>/gi, '')
        .replace(/<\/span>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&ndash;/g, '-')
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim();
      
      console.log(`Cleaned: ${text}`);
    }
    
    count++;
    if (count >= 100) break;
  }
}

main().catch(console.error);
