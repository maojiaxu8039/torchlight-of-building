const https = require("https");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    console.log(`Fetching: ${url}`);
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          console.log(`  Status: ${res.statusCode}, Size: ${data.length}`);
          resolve(data);
        });
        res.on("error", reject);
      })
      .on("error", (err) => {
        console.log(`  Error: ${err.message}`);
        reject(err);
      });
  });
}

async function checkVoraxLimb() {
  console.log("=== Checking Vorax Limb: Hands pages ===\n");

  try {
    const [enHtml, cnHtml] = await Promise.all([
      fetchUrl("https://tlidb.com/en/Vorax_Limb%3A_Hands"),
      fetchUrl("https://tlidb.com/cn/Vorax_Limb%3A_Hands"),
    ]);

    console.log("\n=== Extracting translations ===\n");

    // Extract EN
    const trPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let trMatch;

    const enById = {};
    const cnById = {};

    while ((trMatch = trPattern.exec(enHtml)) !== null) {
      const idMatch = trMatch[1].match(/data-modifier-id=["']([^"']+)["']/);
      if (idMatch) {
        const tdMatch = trMatch[1].match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
        if (tdMatch && tdMatch.length > 0) {
          const lastTd = tdMatch[tdMatch.length - 1];
          const text = lastTd
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
          if (text && text.length > 2) {
            enById[idMatch[1]] = text;
          }
        }
      }
    }

    while ((trMatch = trPattern.exec(cnHtml)) !== null) {
      const idMatch = trMatch[1].match(/data-modifier-id=["']([^"']+)["']/);
      if (idMatch) {
        const tdMatch = trMatch[1].match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
        if (tdMatch && tdMatch.length > 0) {
          const lastTd = tdMatch[tdMatch.length - 1];
          const text = lastTd
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
          if (text && text.length > 2) {
            cnById[idMatch[1]] = text;
          }
        }
      }
    }

    console.log(`EN modifiers: ${Object.keys(enById).length}`);
    console.log(`CN modifiers: ${Object.keys(cnById).length}`);

    // Match
    const translations = {};
    Object.entries(enById).forEach(([id, enText]) => {
      if (cnById[id] && enText !== cnById[id]) {
        translations[enText] = cnById[id];
        console.log(`  ✅ ${enText}`);
        console.log(`     → ${cnById[id]}`);
      }
    });

    console.log(`\nTotal matched: ${Object.keys(translations).length}`);
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

checkVoraxLimb();
