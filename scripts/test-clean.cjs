const text = '<span data-modifier-id="140520600"><span class="text-mod">+2</span> 物理技能等级</span><td>100';

const idRegex = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)(?=<td|data-modifier-id=|$)/gi;
const match = idRegex.exec(text);

console.log('Step 1 - idRegex:');
console.log('  ID:', match[1]);
console.log('  Text:', match[2]);

let result = match[2];

let parts = [];
const modSpanRegex = /<span[^>]*data-modifier-id[^>]*>([\s\S]*?)<\/span>\s*<td>/gi;
let m;
while ((m = modSpanRegex.exec(result))) {
  console.log('Step 2 - modSpanRegex:', m[1]);
}

if (parts.length === 0) {
  const altRegex = /<span[^>]*data-modifier-id[^>]*>([\s\S]*?)<td>/gi;
  while ((m = altRegex.exec(result))) {
    console.log('Step 3 - altRegex:', m[1]);
  }
}

console.log('Parts:', parts);
console.log('Result after altRegex:', result.substring(0, 50));
