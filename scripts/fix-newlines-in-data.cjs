const fs = require("fs");
const path = require("path");

const gearAffixDir = path.join(__dirname, "../src/data/gear-affix");

const files = fs.readdirSync(gearAffixDir).filter(f => f.endsWith(".ts"));

let fixed = 0;

files.forEach(file => {
  const filePath = path.join(gearAffixDir, file);
  let content = fs.readFileSync(filePath, "utf8");
  
  // 替换 \n 为空格
  const newContent = content.replace(/\\n/g, " ");
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    fixed++;
    console.log("Fixed: " + file);
  }
});

console.log("\nFixed " + fixed + " files");
