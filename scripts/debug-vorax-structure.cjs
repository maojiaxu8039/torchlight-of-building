const https = require("https");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

async function debugStructure() {
  console.log("=== Debugging HTML structure ===\n");

  try {
    const html = await fetchUrl("https://tlidb.com/en/Vorax_Limb%3A_Hands");

    // Find first 500 chars around a data-modifier-id
    const idx = html.indexOf("data-modifier-id");
    if (idx !== -1) {
      console.log("Found data-modifier-id at position:", idx);
      console.log("\nContext:");
      console.log(html.substring(Math.max(0, idx - 100), idx + 200));
    } else {
      console.log("No data-modifier-id found");
    }

    // Check table structure
    const tableIdx = html.indexOf("<table");
    if (tableIdx !== -1) {
      console.log("\n\nTable context:");
      console.log(html.substring(tableIdx, tableIdx + 500));
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

debugStructure();
