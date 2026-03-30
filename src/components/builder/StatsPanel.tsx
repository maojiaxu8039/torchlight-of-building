import type { ImplementedActiveSkillName } from "@/src/data/skill/types";
import { Trans } from "@lingui/react/macro";
import { i18n } from "@/src/lib/i18n";
import type {
  CritChance,
  OffenseComboDpsSummary,
  OffenseSlashStrikeDpsSummary,
  OffenseSpellBurstDpsSummary,
  OffenseSpellDpsSummary,
  PersistentDpsSummary,
  Resistance,
  TotalReapDpsSummary,
} from "@/src/tli/calcs/offense";
import { formatStatValue } from "../../lib/calculations-utils";
import { useCalculationsSelectedSkill } from "../../stores/builderStore";
import { useOffenseResults } from "./OffenseResultsContext";

const formatRes = (res: Resistance): string => {
  if (res.potential > res.actual) {
    return `${res.actual}% (${res.potential}%)`;
  }
  return `${res.actual}%`;
};

const formatCritChance = (crit: CritChance): string => {
  const actual = formatStatValue.percentage(crit.actual);
  if (crit.uncapped > 1) {
    return `${actual} (${formatStatValue.percentage(crit.uncapped)})`;
  }
  return actual;
};

const StatLine = ({
  label,
  value,
  highlight,
  color,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
  color?: string;
}): React.ReactNode => {
  const valueClass =
    highlight === true
      ? "text-amber-400 font-bold"
      : (color ?? "text-zinc-200");
  return (
    <div className="flex justify-between text-sm">
      <span className="text-zinc-400">{label}:</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
};

const PersistentDpsSection = ({
  summary,
}: {
  summary: PersistentDpsSummary;
}): React.ReactNode => {
  return (
    <>
      <StatLine
        label={i18n._("Persistent DPS")}
        value={formatStatValue.dps(summary.total)}
        highlight
      />
      <StatLine
        label={i18n._("Duration")}
        value={formatStatValue.duration(summary.duration)}
      />
    </>
  );
};

const ReapDpsSection = ({
  summary,
}: {
  summary: TotalReapDpsSummary;
}): React.ReactNode => {
  return (
    <>
      <StatLine
        label={i18n._("Total Reap DPS")}
        value={formatStatValue.dps(summary.totalReapDps)}
        highlight
      />
      <StatLine
        label={i18n._("Duration Bonus")}
        value={formatStatValue.pct(summary.reapDurationBonusPct)}
      />
      <StatLine
        label={i18n._("CDR Bonus")}
        value={formatStatValue.pct(summary.reapCdrBonusPct)}
      />
    </>
  );
};

const SpellDpsSection = ({
  summary,
}: {
  summary: OffenseSpellDpsSummary;
}): React.ReactNode => {
  return (
    <>
      <StatLine
        label={i18n._("Spell DPS")}
        value={formatStatValue.dps(summary.avgDps)}
        highlight
      />
      <StatLine
        label={i18n._("Avg Hit (crit)")}
        value={formatStatValue.damage(summary.avgHitWithCrit)}
      />
      <StatLine
        label={i18n._("Crit Chance")}
        value={formatCritChance(summary.critChance)}
      />
      <StatLine
        label={i18n._("Crit Multiplier")}
        value={formatStatValue.multiplier(summary.critDmgMult)}
      />
      <StatLine
        label={i18n._("Casts/sec")}
        value={formatStatValue.aps(summary.castsPerSec)}
      />
    </>
  );
};

const ComboDpsSection = ({
  summary,
}: {
  summary: OffenseComboDpsSummary;
}): React.ReactNode => {
  return (
    <>
      <StatLine
        label={i18n._("Combo DPS")}
        value={formatStatValue.dps(summary.avgDps)}
        highlight
      />
      <StatLine label={i18n._("Combo Points")} value={summary.comboPoints} />
      <StatLine
        label={i18n._("Finisher Amplification")}
        value={formatStatValue.pct(summary.comboFinisherAmplificationPct)}
      />
      <StatLine
        label={i18n._("Crit Multiplier")}
        value={formatStatValue.multiplier(summary.critDmgMult)}
      />
    </>
  );
};

const SlashStrikeDpsSection = ({
  summary,
}: {
  summary: OffenseSlashStrikeDpsSummary;
}): React.ReactNode => {
  return (
    <>
      <StatLine
        label={i18n._("Slash Strike DPS")}
        value={formatStatValue.dps(summary.avgDps)}
        highlight
      />
      <StatLine
        label={i18n._("Steep Strike Chance")}
        value={formatStatValue.pct(summary.steepStrikeChancePct)}
      />
      <StatLine
        label={i18n._("Crit Multiplier")}
        value={formatStatValue.multiplier(summary.critDmgMult)}
      />
      <StatLine
        label={i18n._("Sweep Avg Hit")}
        value={formatStatValue.damage(summary.sweep.mainhand.avgHit)}
      />
      <StatLine
        label={i18n._("Sweep Avg (crit)")}
        value={formatStatValue.damage(summary.sweep.mainhand.avgHitWithCrit)}
      />
      <StatLine
        label={i18n._("Steep Avg Hit")}
        value={formatStatValue.damage(summary.steep.mainhand.avgHit)}
      />
      <StatLine
        label={i18n._("Steep Avg (crit)")}
        value={formatStatValue.damage(summary.steep.mainhand.avgHitWithCrit)}
      />
      <StatLine
        label={i18n._("Crit Chance")}
        value={formatCritChance(summary.sweep.mainhand.critChance)}
      />
      <StatLine
        label={i18n._("Attack Speed")}
        value={formatStatValue.aps(summary.sweep.mainhand.aspd)}
      />
      {summary.multistrikeChancePct > 0 && (
        <>
          <StatLine
            label={i18n._("Multistrike Chance")}
            value={formatStatValue.pct(summary.multistrikeChancePct)}
          />
          <StatLine
            label={i18n._("Multistrike Dmg Inc")}
            value={formatStatValue.pct(summary.multistrikeIncDmgPct)}
          />
        </>
      )}
    </>
  );
};

const SpellBurstDpsSection = ({
  summary,
}: {
  summary: OffenseSpellBurstDpsSummary;
}): React.ReactNode => {
  return (
    <>
      <StatLine
        label={i18n._("Burst DPS")}
        value={formatStatValue.dps(summary.avgDps)}
        highlight
      />
      <StatLine
        label={i18n._("Bursts/sec")}
        value={summary.burstsPerSec.toFixed(2)}
      />
      <StatLine
        label={i18n._("Max Spell Burst")}
        value={formatStatValue.integer(summary.maxSpellBurst)}
      />
      {summary.ingenuityOverload !== undefined && (
        <>
          <StatLine
            label={i18n._("Overload DPS")}
            value={formatStatValue.dps(summary.ingenuityOverload.avgDps)}
            color="text-teal-400"
          />
          <StatLine
            label={i18n._("Overload Interval")}
            value={formatStatValue.duration(summary.ingenuityOverload.interval)}
            color="text-teal-400"
          />
        </>
      )}
    </>
  );
};

export const StatsPanel = (): React.ReactNode => {
  const savedSkillName = useCalculationsSelectedSkill();
  const selectedSkill = savedSkillName as
    | ImplementedActiveSkillName
    | undefined;

  const offenseResults = useOffenseResults();
  const { skills, resourcePool, defenses } = offenseResults;
  const offenseSummary =
    selectedSkill !== undefined ? skills[selectedSkill] : undefined;

  const hasDamageStats =
    offenseSummary?.attackDpsSummary !== undefined ||
    offenseSummary?.comboDpsSummary !== undefined ||
    offenseSummary?.slashStrikeDpsSummary !== undefined ||
    offenseSummary?.spellDpsSummary !== undefined ||
    offenseSummary?.spellBurstDpsSummary !== undefined ||
    offenseSummary?.persistentDpsSummary !== undefined ||
    offenseSummary?.totalReapDpsSummary !== undefined;

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-4">
      <h3 className="mb-3 text-lg font-semibold text-zinc-50">
        <Trans>Stats Summary</Trans>
      </h3>

      <div className="space-y-0.5">
        {hasDamageStats && offenseSummary !== undefined ? (
          <>
            <StatLine label={i18n._("Skill")} value={selectedSkill ?? ""} />
            <StatLine
              label={i18n._("Total DPS")}
              value={formatStatValue.dps(offenseSummary.totalDps)}
              highlight
            />

            {offenseSummary.attackDpsSummary !== undefined && (
              <>
                <StatLine
                  label={i18n._("Average DPS")}
                  value={formatStatValue.dps(
                    offenseSummary.attackDpsSummary.avgDps,
                  )}
                  highlight
                />
                <StatLine
                  label={i18n._("Crit Multiplier")}
                  value={formatStatValue.multiplier(
                    offenseSummary.attackDpsSummary.critDmgMult,
                  )}
                />
                <StatLine
                  label={
                    offenseSummary.attackDpsSummary.offhand !== undefined
                      ? i18n._("Avg Hit (MH)")
                      : i18n._("Avg Hit")
                  }
                  value={formatStatValue.damage(
                    offenseSummary.attackDpsSummary.mainhand.avgHit,
                  )}
                />
                <StatLine
                  label={
                    offenseSummary.attackDpsSummary.offhand !== undefined
                      ? i18n._("Avg Hit crit (MH)")
                      : i18n._("Avg Hit (crit)")
                  }
                  value={formatStatValue.damage(
                    offenseSummary.attackDpsSummary.mainhand.avgHitWithCrit,
                  )}
                />
                <StatLine
                  label={
                    offenseSummary.attackDpsSummary.offhand !== undefined
                      ? i18n._("Crit Chance (MH)")
                      : i18n._("Crit Chance")
                  }
                  value={formatCritChance(
                    offenseSummary.attackDpsSummary.mainhand.critChance,
                  )}
                />
                <StatLine
                  label={
                    offenseSummary.attackDpsSummary.offhand !== undefined
                      ? i18n._("Attack Speed (MH)")
                      : i18n._("Attack Speed")
                  }
                  value={formatStatValue.aps(
                    offenseSummary.attackDpsSummary.mainhand.aspd,
                  )}
                />
                {offenseSummary.attackDpsSummary.offhand !== undefined && (
                  <>
                    <StatLine
                      label={i18n._("Avg Hit (OH)")}
                      value={formatStatValue.damage(
                        offenseSummary.attackDpsSummary.offhand.avgHit,
                      )}
                    />
                    <StatLine
                      label={i18n._("Avg Hit crit (OH)")}
                      value={formatStatValue.damage(
                        offenseSummary.attackDpsSummary.offhand.avgHitWithCrit,
                      )}
                    />
                    <StatLine
                      label={i18n._("Crit Chance (OH)")}
                      value={formatCritChance(
                        offenseSummary.attackDpsSummary.offhand.critChance,
                      )}
                    />
                    <StatLine
                      label={i18n._("Attack Speed (OH)")}
                      value={formatStatValue.aps(
                        offenseSummary.attackDpsSummary.offhand.aspd,
                      )}
                    />
                  </>
                )}
                {offenseSummary.attackDpsSummary.multistrikeChancePct > 0 && (
                  <>
                    <StatLine
                      label={i18n._("Multistrike Chance")}
                      value={formatStatValue.pct(
                        offenseSummary.attackDpsSummary.multistrikeChancePct,
                      )}
                    />
                    <StatLine
                      label={i18n._("Multistrike Dmg Inc")}
                      value={formatStatValue.pct(
                        offenseSummary.attackDpsSummary.multistrikeIncDmgPct,
                      )}
                    />
                  </>
                )}
              </>
            )}

            {offenseSummary.comboDpsSummary !== undefined && (
              <>
                <div className="h-2" />
                <ComboDpsSection summary={offenseSummary.comboDpsSummary} />
              </>
            )}

            {offenseSummary.slashStrikeDpsSummary !== undefined && (
              <>
                <div className="h-2" />
                <SlashStrikeDpsSection
                  summary={offenseSummary.slashStrikeDpsSummary}
                />
              </>
            )}

            {offenseSummary.spellDpsSummary !== undefined && (
              <SpellDpsSection summary={offenseSummary.spellDpsSummary} />
            )}

            {offenseSummary.spellBurstDpsSummary !== undefined && (
              <>
                <div className="h-2" />
                <SpellBurstDpsSection
                  summary={offenseSummary.spellBurstDpsSummary}
                />
              </>
            )}

            {offenseSummary.persistentDpsSummary !== undefined && (
              <>
                <div className="h-2" />
                <PersistentDpsSection
                  summary={offenseSummary.persistentDpsSummary}
                />
              </>
            )}

            {offenseSummary.totalReapDpsSummary !== undefined && (
              <>
                <div className="h-2" />
                <ReapDpsSection summary={offenseSummary.totalReapDpsSummary} />
              </>
            )}

            {offenseSummary.tangleSummary !== undefined && (
              <>
                <div className="h-2" />
                <StatLine
                  label={i18n._("Max Tangles")}
                  value={formatStatValue.integer(
                    offenseSummary.tangleSummary.maxTangles,
                  )}
                />
                <StatLine
                  label={i18n._("Max Tangles/Enemy")}
                  value={formatStatValue.integer(
                    offenseSummary.tangleSummary.maxTanglesPerEnemy,
                  )}
                />
              </>
            )}

            <div className="h-2" />
            <StatLine
              label={i18n._("Movement Speed")}
              value={formatStatValue.pct(offenseSummary.movementSpeedBonusPct)}
              color="text-green-400"
            />

            <div className="h-2" />
          </>
        ) : (
          <p className="mb-3 text-sm text-zinc-400">
            <Trans>
              Select an active skill in the Calculations tab to view damage
              stats.
            </Trans>
          </p>
        )}

        <StatLine
          label={i18n._("STR")}
          value={formatStatValue.integer(resourcePool.stats.str)}
        />
        <StatLine
          label={i18n._("DEX")}
          value={formatStatValue.integer(resourcePool.stats.dex)}
        />
        <StatLine
          label={i18n._("INT")}
          value={formatStatValue.integer(resourcePool.stats.int)}
        />

        <div className="h-2" />

        <StatLine
          label={i18n._("Max Life")}
          value={formatStatValue.integer(resourcePool.maxLife)}
          color="text-red-400"
        />
        <StatLine
          label={i18n._("Max Mana")}
          value={formatStatValue.integer(resourcePool.maxMana)}
          color="text-blue-400"
        />
        {resourcePool.sealedResources.sealedManaPct > 0 && (
          <StatLine
            label={i18n._("Sealed Mana")}
            value={formatStatValue.pct(
              resourcePool.sealedResources.sealedManaPct,
            )}
            color="text-blue-300"
          />
        )}
        {resourcePool.sealedResources.sealedLifePct > 0 && (
          <StatLine
            label={i18n._("Sealed Life")}
            value={formatStatValue.pct(
              resourcePool.sealedResources.sealedLifePct,
            )}
            color="text-red-300"
          />
        )}
        {resourcePool.mercuryPts !== undefined && (
          <StatLine
            label={i18n._("Mercury")}
            value={formatStatValue.integer(resourcePool.mercuryPts)}
            color="text-purple-400"
          />
        )}

        <div className="h-2" />

        <StatLine
          label={i18n._("Energy Shield")}
          value={formatStatValue.integer(defenses.energyShield)}
          color="text-teal-400"
        />

        <StatLine
          label={i18n._("Armor")}
          value={formatStatValue.integer(defenses.armor)}
          color="text-red-400"
        />

        <StatLine
          label={i18n._("Evasion")}
          value={formatStatValue.integer(defenses.evasion)}
          color="text-green-400"
        />

        <div className="h-2" />

        <StatLine
          label={i18n._("Cold Res")}
          value={formatRes(defenses.coldRes)}
          color="text-cyan-400"
        />
        <StatLine
          label={i18n._("Lightning Res")}
          value={formatRes(defenses.lightningRes)}
          color="text-yellow-400"
        />
        <StatLine
          label={i18n._("Fire Res")}
          value={formatRes(defenses.fireRes)}
          color="text-orange-400"
        />
        <StatLine
          label={i18n._("Erosion Res")}
          value={formatRes(defenses.erosionRes)}
          color="text-fuchsia-400"
        />

        <div className="h-2" />

        <StatLine
          label={i18n._("Attack Block")}
          value={formatStatValue.pct(defenses.attackBlockPct)}
          color="text-slate-300"
        />
        <StatLine
          label={i18n._("Spell Block")}
          value={formatStatValue.pct(defenses.spellBlockPct)}
          color="text-slate-300"
        />
        <StatLine
          label={i18n._("Block Ratio")}
          value={formatStatValue.pct(defenses.blockRatioPct)}
          color="text-slate-300"
        />
      </div>
    </div>
  );
};
