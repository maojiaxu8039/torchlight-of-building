import { TooltipTitle } from "@/src/components/ui/Tooltip";
import { i18n } from "@/src/lib/i18n";
import { getGearAffixes } from "@/src/tli/calcs/affix-collectors";
import type { Gear } from "@/src/tli/core";
import { getTranslatedAffixText } from "@/src/lib/affix-translator";
import { getBaseGearNameTranslation } from "@/src/data/translated-affixes/base-gear-name-translations";

export const GearTooltipContent: React.FC<{ item: Gear }> = ({ item }) => {
  const isLegendary = item.rarity === "legendary";
  const affixes = getGearAffixes(item);

  return (
    <>
      <TooltipTitle>
        {item.legendaryName ?? getBaseGearNameTranslation(item.baseGearName) ?? item.equipmentType}
      </TooltipTitle>
      {isLegendary && (
        <div className="text-xs text-zinc-500 mb-2">{item.equipmentType}</div>
      )}
      {affixes.length > 0 ? (
        <div>
          {affixes.map((affix, affixIdx) => (
            <div
              key={affixIdx}
              className={
                affixIdx > 0 ? "mt-2 pt-2 border-t border-zinc-500" : ""
              }
            >
              {affix.voraxLegendaryName !== undefined && (
                <div className="text-xs font-semibold text-amber-400 mb-0.5">
                  [{affix.voraxLegendaryName}]
                </div>
              )}
              {affix.specialName !== undefined && (
                <div className="text-xs font-semibold text-amber-400 mb-0.5">
                  [{affix.specialName}]
                </div>
              )}
              {affix.affixLines.map((line, lineIdx) => (
                <div
                  key={lineIdx}
                  className={
                    lineIdx > 0 ? "mt-1 pt-1 border-t border-zinc-800" : ""
                  }
                >
                  <div className="text-xs text-zinc-400">{getTranslatedAffixText(line.text)}</div>
                  {line.mods === undefined && (
                    <div className="text-xs text-red-500">
                      (Mod not supported in TOB yet)
                    </div>
                  )}
                </div>
              ))}
              {affix.maxDivinity !== undefined && (
                <div className="text-xs text-zinc-500">
                  (Max Divinity Effect: {affix.maxDivinity})
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-zinc-500 italic">{i18n._("No affixes")}</p>
      )}
    </>
  );
};
