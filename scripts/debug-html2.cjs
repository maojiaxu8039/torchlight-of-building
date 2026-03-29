const fs = require("fs");

const html = fs.readFileSync(".garbage/tlidb/gear/belt.html", "utf-8");

// 查找一个包含 data-modifier-id 的片段
const sample = html.match(/data-modifier-id="1500100"[^>]*>[\s\S]{0,200}/);
if (sample) {
  console.log("Original:");
  console.log(sample[0]);
  console.log("\n---\n");
  
  // 测试正则
  const idRegex = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)(?=<i\s|data-modifier-id="|$)/gi;
  const match = idRegex.exec(sample[0]);
  if (match) {
    console.log("Match groups:");
    console.log("ID:", match[1]);
    console.log("Text before cleanup:", match[2]);
    
    let text = match[2];
    text = text.replace(/<span[^>]*>/gi, "");
    text = text.replace(/<\/span>/gi, "");
    text = text.replace(/<[^>]+>/g, "");
    console.log("Text after cleanup:", text);
  }
}
