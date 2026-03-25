import { getGearAffixes } from '../src/tli/calcs/affix-collectors.ts';
import type { Gear } from '../src/tli/core.ts';
import * as allBaseGear from '../src/data/gear-base/all-base-gear.ts';

console.log('=== Checking Gear Data Structure ===\n');

const beltGears = allBaseGear.default.filter(g => g.equipmentType === 'Belt');

console.log(`Found ${beltGears.length} Belt items\n`);

if (beltGears.length > 0) {
  const firstBelt = beltGears[0];
  console.log('First Belt item:');
  console.log('  Equipment Type:', firstBelt.equipmentType);
  console.log('  Base Gear Name:', firstBelt.baseGearName);
  console.log('  Stats:', firstBelt.stats?.slice(0, 2));

  const affixes = getGearAffixes(firstBelt);
  console.log('  Affixes count:', affixes.length);

  if (affixes.length > 0) {
    console.log('  First Affix:');
    console.log('    AffixLines:', affixes[0].affixLines.length);
    if (affixes[0].affixLines.length > 0) {
      console.log('    First line text:', affixes[0].affixLines[0].text);
    }
  }
}

console.log('\n=== Sample Elder Sage Girdle ===');
const elderSage = beltGears.find(g => g.baseGearName === 'Elder Sage Girdle');
if (elderSage) {
  console.log('Found Elder Sage Girdle');
  console.log('  Stats:', elderSage.stats);
  const affixes = getGearAffixes(elderSage);
  console.log('  Affixes:', affixes.length);
  if (affixes.length > 0) {
    affixes.forEach((affix, i) => {
      console.log(`  Affix ${i}: ${affix.affixLines.length} lines`);
      affix.affixLines.forEach((line, j) => {
        console.log(`    Line ${j}: "${line.text}"`);
      });
    });
  }
} else {
  console.log('Elder Sage Girdle not found in Belt items');
}
