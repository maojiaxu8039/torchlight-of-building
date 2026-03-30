import { useMemo } from "react";
import { SearchableSelect } from "@/src/components/ui/SearchableSelect";
import { Trans } from "@lingui/react/macro";
import { i18n } from "@/src/lib/i18n";
import { getUniqueHeroes } from "../../lib/hero-utils";

interface HeroSelectorProps {
  selectedHero: string | undefined;
  onHeroChange: (hero: string | undefined) => void;
}

export const HeroSelector = ({
  selectedHero,
  onHeroChange,
}: HeroSelectorProps) => {
  const uniqueHeroes = useMemo(() => getUniqueHeroes(), []);

  return (
    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
      <h2 className="text-xl font-semibold mb-4 text-zinc-50">
        <Trans>Select Hero</Trans>
      </h2>
      <SearchableSelect
        value={selectedHero}
        onChange={onHeroChange}
        options={uniqueHeroes.map((hero) => ({
          value: hero,
          label: i18n._(hero),
        }))}
        placeholder={i18n._("Select a hero...")}
        size="lg"
      />
    </div>
  );
};
