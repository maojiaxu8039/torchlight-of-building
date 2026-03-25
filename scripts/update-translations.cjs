const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../src/data/translated-affixes');
const tsFile = path.join(outDir, 'complete-affix-translations.ts');

// 加载所有翻译文件
const allTranslations = {};
const files = fs.readdirSync(outDir).filter(f => f.endsWith('-translations.json') && !f.startsWith('complete-') && !f.startsWith('all-'));

files.forEach(file => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(outDir, file), 'utf8'));
    Object.entries(data).forEach(([en, cn]) => {
      if (typeof cn === 'string' && cn.length > 0) {
        allTranslations[en] = cn;
      }
    });
    console.log(`✅ ${file}: ${Object.keys(data).length} translations`);
  } catch (e) {
    console.log(`⚠️ ${file}: Error - ${e.message}`);
  }
});

console.log(`\n✅ Total valid translations: ${Object.keys(allTranslations).length}`);

// 读取当前的 TS 文件
let tsContent = fs.readFileSync(tsFile, 'utf8');

// 移除所有现有的翻译（保留函数定义）
const beforeBracket = tsContent.split('export const AFFIX_NAME_TRANSLATIONS: Record<string, string> = {')[0];
const afterBracket = '};' + tsContent.split('};').slice(1).join('};');

// 生成新的翻译内容
let translationsContent = 'export const AFFIX_NAME_TRANSLATIONS: Record<string, string> = {\n';

Object.entries(allTranslations).forEach(([en, cn]) => {
  const escapedEn = en.replace(/'/g, "\\'");
  const escapedCn = cn.replace(/'/g, "\\'");
  translationsContent += `  '${escapedEn}': '${escapedCn}',\n`;
});

translationsContent += '};';

// 重新组合文件
tsContent = beforeBracket + translationsContent + afterBracket;

// 写入文件
fs.writeFileSync(tsFile, tsContent, 'utf-8');

console.log(`\n✅ Updated complete-affix-translations.ts`);
