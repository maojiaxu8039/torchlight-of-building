import {
  AFFIX_TRANSLATIONS,
  AFFIX_NAME_TRANSLATIONS,
} from "@/src/data/translated-affixes/complete-affix-translations";
import { BASE_GEAR_NAME_TRANSLATIONS } from "@/src/data/translated-affixes/base-gear-name-translations";
import type { BaseGearAffix } from "@/src/tli/gear-data-types";

const NUMBER_PATTERN =
  /([+-]?\d+(?:\.\d+)?(?:–|-)\d+(?:\.\d+)?|[+-]?\d+(?:\.\d+)?%)?/g;
const VALUE_PATTERN =
  /([+-]?\d+(?:\.\d+)?(?:–|-)\d+(?:\.\d+)?|[+-]?\d+(?:\.\d+)?%)/g;

function normalizeNumber(value: string): string {
  return value.replace(/–/g, "-").replace(/\s+/g, "");
}

function textToPattern(text: string): string {
  return text
    .replace(/[+-]?\d+(?:\.\d+)?-\d+(?:\.\d+)?/g, "#RANGE#")
    .replace(/[+-]?\d+(?:\.\d+)?%/g, "#PERCENT#")
    .replace(/[+-]?\d+(?:\.\d+)?/g, "#NUM#");
}

export function translateAffixText(enText: string): string {
  if (!enText || typeof enText !== "string") {
    return enText;
  }

  if (AFFIX_NAME_TRANSLATIONS[enText]) {
    return AFFIX_NAME_TRANSLATIONS[enText];
  }

  let translatedText = enText;

  const sortedKeys = Object.keys(AFFIX_NAME_TRANSLATIONS).sort(
    (a, b) => b.length - a.length,
  );

  sortedKeys.forEach((enKey) => {
    const cnValue = AFFIX_NAME_TRANSLATIONS[enKey];
    const regex = new RegExp(
      enKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "gi",
    );
    translatedText = translatedText.replace(regex, cnValue);
  });

  return translatedText;
}

const translationLookup = AFFIX_TRANSLATIONS;

export function translateAffixObject(affix: BaseGearAffix): string {
  if (!affix) return "";

  if (affix.modifierId && translationLookup[affix.modifierId]) {
    return translationLookup[affix.modifierId] as string;
  }

  return getTranslatedAffixText(affix.craftableAffix);
}

export function getTranslatedAffixText(text: string): string {
  if (!text) return text;

  if (AFFIX_NAME_TRANSLATIONS[text]) {
    return AFFIX_NAME_TRANSLATIONS[text];
  }

  if (BASE_GEAR_NAME_TRANSLATIONS[text]) {
    return BASE_GEAR_NAME_TRANSLATIONS[text];
  }

  let result = text;

  const sortedKeys = Object.keys(AFFIX_NAME_TRANSLATIONS).sort(
    (a, b) => b.length - a.length,
  );

  for (const key of sortedKeys) {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // 匹配开头或空格后面跟着 key
    const regex = new RegExp(`(^|(?<=\\s))(${escapedKey})(?=\\s|$|,)`, "gi");
    const replacement = (
      match: string,
      lookbehind: string,
      matchedText: string,
    ) => {
      return AFFIX_NAME_TRANSLATIONS[matchedText] || matchedText;
    };
    result = result.replace(regex, replacement);
  }

  for (const [enName, cnName] of Object.entries(BASE_GEAR_NAME_TRANSLATIONS)) {
    const regex = new RegExp(
      `(^|\\s)${enName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=\\s|$|,)`,
      "gi",
    );
    result = result.replace(regex, `$1${cnName}`);
  }

  return result;
}

export function translateModValue(value: number): string {
  return value.toString();
}

export const useAffixTranslation = () => {
  const translate = (text: string): string => {
    return getTranslatedAffixText(text);
  };

  return { translate };
};
