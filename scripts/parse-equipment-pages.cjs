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

async function main() {
  console.log("=== Equipment Links from Inventory ===\n");

  // Inventory 页面找到的链接
  const links = [
    // 从之前的输出中提取
    "/en/Drop_Source",
    "/en/Triggered_Skill",
    "/en/Activation_Medium_Skill",
    "/en/Noble_Support_Skill",
    "/en/Magnificent_Support_Skill",
    "/en/Corrosion",
    "/en/Gear_Empowerment",
    "/en/Confusion_Card_Library",
    "/en/Void_Chart",
    "/en/Compass",
  ];

  // 从之前抓取的分类中提取
  const equipmentTypes = [
    "Belt",
    "STR_Helmet",
    "DEX_Helmet",
    "INT_Helmet",
    "STR_Gloves",
    "DEX_Gloves",
    "INT_Gloves",
    "STR_Boots",
    "DEX_Boots",
    "INT_Boots",
    "One_Handed_Weapon",
    "Two_Handed_Weapon",
    "Claw",
    "Sword",
    "Axe",
    "Hammer",
    "Staff",
    "Rod",
    "Wand",
    "Bow",
    "Crossbow",
    "Gun",
    "Pistol",
    "Musket",
    "Cannon",
    "Dagger",
    "Scythe",
    "Maul",
    "Spear",
    "Shield",
    "Necklace",
    "Ring",
    "Waistguard",
    "Breastpin",
    "Plume",
    "Reversal",
    "STR_Waistguard",
    "DEX_Waistguard",
    "INT_Waistguard",
    "STR_Breastpin",
    "DEX_Breastpin",
    "INT_Breastpin",
  ];

  console.log("=== Equipment Types Found ===\n");

  equipmentTypes.forEach((type, idx) => {
    console.log(`${idx + 1}. ${type}`);
  });

  console.log(`\nTotal: ${equipmentTypes.length}`);
}

main();
