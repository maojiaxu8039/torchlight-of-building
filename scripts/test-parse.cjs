const text = '<span data-modifier-id="140520600"><span class="text-mod">+2</span> 物理技能等级</span><td>100<td>0<td>进阶词缀';

function cleanText(text) {
  let result = text;
  
  result = result.replace(/data-bs-title="[^"]*"/gi, "");
  result = result.replace(/data-bs-html="[^"]*"/gi, "");
  result = result.replace(/data-bs-toggle="[^"]*"/gi, "");
  result = result.replace(/data-hover="[^"]*"/gi, "");
  result = result.replace(/data-tip="[^"]*"/gi, "");
  result = result.replace(/data-section="[^"]*"/gi, "");
  result = result.replace(/data-tier="[^"]*"/gi, "");
  
  let parts = [];
  
  const modSpanRegex = /<span[^>]*data-modifier-id[^>]*>([\s\S]*?)<\/span>\s*<td>/gi;
  let m;
  while ((m = modSpanRegex.exec(result))) {
    let content = m[1];
    content = content.replace(/<[^>]+>/g, ' ');
    content = content.replace(/\s+/g, ' ').trim();
    if (content) {
      parts.push(content);
    }
  }
  
  if (parts.length === 0) {
    const altRegex = /data-modifier-id[^>]*>([\s\S]*?)<td>/gi;
    while ((m = altRegex.exec(result))) {
      let content = m[1];
      content = content.replace(/<[^>]+>/g, ' ');
      content = content.replace(/\s+/g, ' ').trim();
      if (content) {
        parts.push(content);
      }
    }
  }
  
  if (parts.length > 0) {
    result = parts.join(' ');
  } else {
    result = result.replace(/<[^>]+>/g, ' ');
  }
  
  result = result.replace(/<div[^>]*>/gi, " ");
  result = result.replace(/<\/div>/gi, " ");
  result = result.replace(/<hr[^>]*>/gi, " ");
  result = result.replace(/<br\s*\/?>/gi, " ");
  result = result.replace(/<i[^>]*>.*?<\/i>/gi, "");
  result = result.replace(/<e[^>]*>([^<]*)<\/e>/gi, "$1");
  result = result.replace(/<a[^>]*>([^<]*)<\/a>/gi, "$1");
  result = result.replace(/<img[^>]*>/gi, "");
  result = result.replace(/<span[^>]*>/gi, "");
  result = result.replace(/<\/span>/gi, "");
  result = result.replace(/<[^>]+>/g, "");
  result = result.replace(/&nbsp;/g, " ");
  result = result.replace(/&ndash;/g, "-");
  result = result.replace(/&amp;/g, "&");
  result = result.replace(/&gt;/g, ">");
  result = result.replace(/&lt;/g, "<");
  result = result.replace(/\|/g, " ");
  result = result.replace(/\//g, " ");
  
  return result.replace(/\s+/g, ' ').trim();
}

const idRegex = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)(?=<td|data-modifier-id=|$)/gi;
const match = idRegex.exec(text);

console.log('idRegex ID:', match[1]);
console.log('idRegex Text:', match[2]);

const cleaned = cleanText(match[2]);
console.log('Cleaned:', cleaned);
