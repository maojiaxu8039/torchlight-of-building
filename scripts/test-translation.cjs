const translations = require("../src/data/translated-affixes/complete-affix-translations.ts");

const testText =
  "+(7-9)% Elemental Resistance +(12-15)% chance to avoid Elemental Ailment";

console.log("Test text:", testText);
console.log("Direct match:", translations.AFFIX_NAME_TRANSLATIONS[testText]);
