const text = '<span data-modifier-id="140520600"><span class="text-mod">+2</span> 物理技能等级</span><td>100';

const modSpanRegex = /<span[^>]*data-modifier-id[^>]*>([\s\S]*?)<\/span>\s*<td>/gi;
let m;
let count1 = 0;
while ((m = modSpanRegex.exec(text))) {
  console.log('modSpanRegex:', m[1]);
  count1++;
}
console.log('modSpanRegex count:', count1);

const altRegex = /data-modifier-id[^>]*>([\s\S]*?)<td>/gi;
let count2 = 0;
while ((m = altRegex.exec(text))) {
  console.log('altRegex:', m[1]);
  count2++;
}
console.log('altRegex count:', count2);
