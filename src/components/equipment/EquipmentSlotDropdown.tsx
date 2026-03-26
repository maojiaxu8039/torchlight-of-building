import { useMemo, useRef, useState } from "react";
import {
  SearchableSelect,
  type SearchableSelectOption,
} from "@/src/components/ui/SearchableSelect";
import { Tooltip } from "@/src/components/ui/Tooltip";
import { i18n } from "@/src/lib/i18n";
import { getGearAffixes } from "@/src/tli/calcs/affix-collectors";
import type { Gear } from "@/src/tli/core";
import type { GearSlot } from "../../lib/types";
import { GearTooltipContent } from "./GearTooltipContent";
import { getBaseGearNameTranslation } from "@/src/data/translated-affixes/base-gear-name-translations";
import { getTranslatedAffixText } from "@/src/lib/affix-translator";
import { ALL_BASE_GEAR } from "@/src/data/gear-base/all-base-gear";

interface OptionWithTooltipProps {
  item: Gear;
  selected: boolean;
}

const OptionWithTooltip: React.FC<OptionWithTooltipProps> = ({
  item,
  selected,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rect, setRect] = useState<DOMRect | undefined>(undefined);
  const ref = useRef<HTMLDivElement>(null);

  const isLegendary = item.rarity === "legendary";
  const affixes = getGearAffixes(item);

  // 直接使用 affixes[0].affixLines[0].text，和 OptionWithTooltip 完全相同
  const statsText = useMemo(
    () => (affixes.length > 0 && affixes[0].affixLines.length > 0 ? affixes[0].affixLines[0].text : null),
    [affixes]
  );

  const translatedStatsText = useMemo(
    () => statsText ? getTranslatedAffixText(statsText) : null,
    [statsText]
  );

  return (
    <div
      ref={ref}
      onMouseEnter={() => {
        setIsHovered(true);
        if (ref.current) {
          setRect(ref.current.getBoundingClientRect());
        }
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={selected ? "text-amber-400" : ""}>
        {item.legendaryName ?? getBaseGearNameTranslation(item.baseGearName) ?? item.equipmentType}
      </span>
      {translatedStatsText && (
        <span className="text-zinc-500 ml-2 text-xs">
          - {translatedStatsText}
        </span>
      )}
      {isLegendary && (
        <span className="text-amber-400 ml-2 text-xs">Legendary</span>
      )}

      <Tooltip
        isVisible={isHovered}
        triggerRect={rect}
        variant={isLegendary ? "legendary" : "default"}
      >
        <GearTooltipContent item={item} />
      </Tooltip>
    </div>
  );
};

interface EquipmentSlotDropdownProps {
  slot: GearSlot;
  label: string;
  selectedItemId: string | null;
  compatibleItems: Gear[];
  onSelectItem: (slot: GearSlot, itemId: string | null) => void;
}

export const EquipmentSlotDropdown: React.FC<EquipmentSlotDropdownProps> = ({
  slot,
  label,
  selectedItemId,
  compatibleItems,
  onSelectItem,
}) => {
  // 使用和 OptionWithTooltip 完全相同的计算逻辑
  const options = useMemo(
    () => compatibleItems.map((item) => {
      const affixes = getGearAffixes(item);
      // 直接使用 affixes[0].affixLines[0].text
      const statsText = (affixes.length > 0 && affixes[0].affixLines.length > 0 ? affixes[0].affixLines[0].text : null);
      const translatedStatsText = statsText ? getTranslatedAffixText(statsText) : null;
      
      return {
        // biome-ignore lint/style/noNonNullAssertion: inventory items always have id
        value: item.id!,
        label: item.legendaryName ?? getBaseGearNameTranslation(item.baseGearName) ?? item.equipmentType,
        // 使用和 OptionWithTooltip 完全相同的翻译结果
        sublabel: translatedStatsText ? `${translatedStatsText} (${affixes.length})` : `${affixes.length} affixes`,
      };
    }),
    [compatibleItems]
  );

  const renderOption = (
    option: SearchableSelectOption<string>,
    { active, selected }: { active: boolean; selected: boolean },
  ) => {
    const item = compatibleItems.find((i) => i.id === option.value);
    if (!item) return null;

    return (
      <OptionWithTooltip key={option.value} item={item} selected={selected} />
    );
  };

  const renderSelectedTooltip = (
    option: SearchableSelectOption<string>,
    triggerRect: DOMRect,
  ) => {
    const item = compatibleItems.find((i) => i.id === option.value);
    if (!item) return null;

    return (
      <div
        style={{
          position: "absolute",
          left: triggerRect.left,
          top: triggerRect.bottom + 8,
          width: 400,
        }}
        className="rounded-lg border border-zinc-700 bg-zinc-800 p-3 shadow-lg"
      >
        <GearTooltipContent item={item} />
      </div>
    );
  };

  return (
    <div className="flex items-center gap-2 py-1">
      <label className="w-22 shrink-0 font-medium text-zinc-400 text-sm">
        {label}:
      </label>
      <SearchableSelect
        size="sm"
        value={selectedItemId ?? undefined}
        onChange={(value) => onSelectItem(slot, value ?? null)}
        options={options}
        placeholder={i18n._("-- None --")}
        className="min-w-0 flex-1 max-w-xs"
        renderOption={renderOption}
        renderSelectedTooltip={renderSelectedTooltip}
      />
    </div>
  );
};
