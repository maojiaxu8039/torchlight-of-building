import { useEffect, useState } from "react";
import { i18n } from "@/src/lib/i18n";
import type { CraftedPrism } from "@/src/tli/core";
import { PrismInventoryItem } from "./PrismInventoryItem";

interface PrismInventoryProps {
  prisms: CraftedPrism[];
  onEdit: (prism: CraftedPrism) => void;
  onCopy: (prism: CraftedPrism) => void;
  onDelete: (prismId: string) => void;
  selectedPrismId?: string;
  onSelectPrism?: (prismId: string | undefined) => void;
  hasPrismPlaced?: boolean;
  isOnGodGoddessTree?: boolean;
}

export const PrismInventory: React.FC<PrismInventoryProps> = ({
  prisms,
  onEdit,
  onCopy,
  onDelete,
  selectedPrismId,
  onSelectPrism,
  hasPrismPlaced = false,
  isOnGodGoddessTree = false,
}) => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const handleLocaleChange = () => {
      forceUpdate({});
    };
    window.addEventListener("locale-changed", handleLocaleChange);
    return () => {
      window.removeEventListener("locale-changed", handleLocaleChange);
    };
  }, []);

  const selectionMode = !!onSelectPrism;

  const handleSelect = (prismId: string) => {
    if (!onSelectPrism) return;
    // Toggle selection: if already selected, deselect
    if (selectedPrismId === prismId) {
      onSelectPrism(undefined);
    } else {
      onSelectPrism(prismId);
    }
  };

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
      <h3 className="mb-4 text-lg font-medium text-zinc-200">
        {i18n._("Prism Inventory")} ({prisms.length})
      </h3>

      {selectionMode && (
        <div className="mb-3 p-2 rounded bg-purple-500/10 border border-purple-500/30">
          <p className="text-sm text-purple-300">
            {hasPrismPlaced
              ? i18n._("A prism is already placed. Remove it first to place a different one.")
              : selectedPrismId
                ? isOnGodGoddessTree
                  ? i18n._("Switch to a Profession Tree (Slots 2-4) to place the prism.")
                  : i18n._("Click on an empty talent node to place the prism, or click the prism again to deselect.")
                : i18n._("Click a prism to select it for placement.")}
          </p>
        </div>
      )}

      {prisms.length === 0 ? (
        <p className="text-sm text-zinc-500">
          {i18n._("No prisms crafted yet. Create one using the crafter!")}
        </p>
      ) : (
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
          {prisms.map((prism) => {
            const canSelect = !hasPrismPlaced && selectionMode;
            return (
              <PrismInventoryItem
                key={prism.id}
                prism={prism}
                onEdit={() => onEdit(prism)}
                onCopy={() => onCopy(prism)}
                onDelete={() => onDelete(prism.id)}
                isSelected={selectedPrismId === prism.id}
                onSelect={canSelect ? () => handleSelect(prism.id) : undefined}
                selectionMode={canSelect}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
