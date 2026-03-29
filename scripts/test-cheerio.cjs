const cheerio = require("cheerio");
const fs = require("fs");

const html = fs.readFileSync(".garbage/tlidb/gear/belt.html", "utf-8");

const $ = cheerio.load(html);

console.log("🔍 Testing cheerio parsing\n");

// 查找 data-modifier-id
const elements = $("[data-modifier-id]");
console.log(`Found ${elements.length} elements with data-modifier-id`);

// 查找 tr 元素
const trs = $("tbody tr");
console.log(`Found ${trs.length} tbody tr elements`);

// 查找 td 元素
const tds = $("td");
console.log(`Found ${tds.length} td elements`);

// 查找表格
const tables = $("table");
console.log(`Found ${tables.length} tables`);

// 打印第一个包含 data-modifier-id 的 td
const firstTd = $("td").first();
console.log("\nFirst td:");
console.log(firstTd.html());
